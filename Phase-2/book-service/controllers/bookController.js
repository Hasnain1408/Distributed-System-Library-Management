// Book Service: src/controllers/bookController.js
import mongoose from 'mongoose';
import Book from '../models/Book.js';

// Add a new book
const addBook = async (req, res) => {
  try {
    const { title, author, isbn, copies } = req.body;
    
    if (!title || !author) {
      return res.status(400).json({ message: 'Title and author are required' });
    }
    
    // Check if book with ISBN already exists (if ISBN provided)
    if (isbn) {
      const existingBook = await Book.findOne({ isbn });
      if (existingBook) {
        return res.status(400).json({ message: 'Book with this ISBN already exists' });
      }
    }
    
    const copyCount = copies || 1;
    
    const book = await Book.create({
      title,
      author,
      isbn,
      copies: copyCount,
      available_copies: copyCount
    });
    
    res.status(201).json({
      id: book._id,
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      copies: book.copies,
      available_copies: book.available_copies,
      created_at: book.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add book', error: error.message });
  }
};

// Get book by ID
const getBookById = async (req, res) => {
  try {
    const bookId = req.params.id;
    
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: 'Invalid book ID' });
    }
    
    const book = await Book.findById(bookId);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    res.status(200).json({
      id: book._id,
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      copies: book.copies,
      available_copies: book.available_copies,
      created_at: book.createdAt,
      updated_at: book.updatedAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch book', error: error.message });
  }
};

// Search books
const searchBooks = async (req, res) => {
  try {
    const { search, page = 1, per_page = 10 } = req.query;
    let query = {};
    
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { author: { $regex: search, $options: 'i' } },
          { isbn: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    const limit = parseInt(per_page, 10);
    const skip = (parseInt(page, 10) - 1) * limit;
    
    const total = await Book.countDocuments(query);
    const books = await Book.find(query)
      .sort({ title: 1 })
      .skip(skip)
      .limit(limit);
    
    const formattedBooks = books.map(book => ({
      id: book._id,
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      copies: book.copies,
      available_copies: book.available_copies
    }));
    
    res.status(200).json({
      books: formattedBooks,
      total,
      page: parseInt(page, 10),
      per_page: limit
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to search books', error: error.message });
  }
};

// Update book information
const updateBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const { title, author, isbn, copies } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: 'Invalid book ID' });
    }
    
    let book = await Book.findById(bookId);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Build update object with provided fields
    const updateFields = {};
    if (title) updateFields.title = title;
    if (author) updateFields.author = author;
    if (isbn) updateFields.isbn = isbn;
    
    if (copies !== undefined) {
      updateFields.copies = copies;
      // Adjust available copies proportionally
      const diff = copies - book.copies;
      updateFields.available_copies = Math.max(0, book.available_copies + diff);
    }
    
    book = await Book.findByIdAndUpdate(
      bookId,
      updateFields,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      id: book._id,
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      copies: book.copies,
      available_copies: book.available_copies,
      updated_at: book.updatedAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update book', error: error.message });
  }
};

// Delete a book
const deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: 'Invalid book ID' });
    }
    
    const book = await Book.findById(bookId);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    await Book.findByIdAndDelete(bookId);
    
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete book', error: error.message });
  }
};

// Update book availability (used by Loan Service)
const updateBookAvailability = async (req, res) => {
  try {
    const bookId = req.params.id;
    const { operation } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: 'Invalid book ID' });
    }
    
    if (!operation || (operation !== 'increment' && operation !== 'decrement')) {
      return res.status(400).json({ message: 'Valid operation (increment or decrement) is required' });
    }
    
    const book = await Book.findById(bookId);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    if (operation === 'decrement' && book.available_copies <= 0) {
      return res.status(400).json({ message: 'No available copies to borrow' });
    }
    
    const updateValue = operation === 'increment' ? 1 : -1;
    book.available_copies += updateValue;
    await book.save();
    
    res.status(200).json({
      id: book._id,
      available_copies: book.available_copies,
      updated_at: book.updatedAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update book availability', error: error.message });
  }
};

// Get book inventory stats
const getBookInventoryStats = async (req, res) => {
  try {
    const stats = await Book.aggregate([
      {
        $group: {
          _id: null,
          total_books: { $sum: '$copies' },
          books_available: { $sum: '$available_copies' },
          unique_titles: { $sum: 1 }
        }
      }
    ]);
    
    const result = stats.length > 0
      ? {
          total_books: stats[0].total_books,
          books_available: stats[0].books_available,
          books_borrowed: stats[0].total_books - stats[0].books_available,
          unique_titles: stats[0].unique_titles
        }
      : { total_books: 0, books_available: 0, books_borrowed: 0, unique_titles: 0 };
    
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get inventory stats', error: error.message });
  }
};

export {
  addBook,
  getBookById,
  searchBooks,
  updateBook,
  deleteBook,
  updateBookAvailability,
  getBookInventoryStats
};