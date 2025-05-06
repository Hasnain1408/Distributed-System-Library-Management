// controllers/bookController.js - Book controller functions
import mongoose from 'mongoose';
import Book from '../models/Book.js';


// Utility method (not route handler)
export const validateBookIdInternal = (book_id) => {
  return mongoose.Types.ObjectId.isValid(book_id);
};

// Utility method (not route handler)
export const getBookByIdInternal = async (book_id) => {
  if (!mongoose.Types.ObjectId.isValid(book_id)) return null;
  return await Book.findById(book_id);
};

// Utility method to update book copies
export const updateBookCopies = async (book_id, increment) => {
  if (!mongoose.Types.ObjectId.isValid(book_id)) return null;
  const book = await Book.findById(book_id);
  if (!book) return null;
  
  book.available_copies += increment;
  return await book.save();
};

// Utility method to check if book exists and has available copies
export const checkBookAvailability = async (book_id) => {
  const book = await getBookByIdInternal(book_id);
  if (!book) return { exists: false, available: false, book: null };
  return { 
    exists: true, 
    available: book.available_copies > 0,
    book
  };
};

// Utility method for book stats
export const getBookInventoryStats = async () => {
  const booksResult = await Book.aggregate([
    {
      $group: {
        _id: null,
        total_books: { $sum: '$copies' },
        books_available: { $sum: '$available_copies' }
      }
    }
  ]);

  return booksResult.length > 0
    ? {
        total_books: booksResult[0].total_books,
        books_available: booksResult[0].books_available
      }
    : { total_books: 0, books_available: 0 };
};

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
    
    res.status(201).json(book);
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
    
    const book = await getBookByIdInternal(bookId);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch book', error: error.message });
  }
};

// Search books
const searchBooks = async (req, res) => {
  try {
    const searchTerm = req.query.search;
    
    if (!searchTerm) {
      const books = await Book.find().sort({ title: 1 });
      return res.status(200).json(books);
    }
    
    const books = await Book.find({
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { author: { $regex: searchTerm, $options: 'i' } },
        { isbn: { $regex: searchTerm, $options: 'i' } }
      ]
    }).sort({ title: 1 });
    
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Failed to search books', error: error.message });
  }
};

// Update book information
const updateBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const { title, author, isbn, copies, available_copies } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: 'Invalid book ID' });
    }
    
    let book = await getBookByIdInternal(bookId);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Build update object with provided fields
    const updateFields = {};
    if (title) updateFields.title = title;
    if (author) updateFields.author = author;
    if (isbn) updateFields.isbn = isbn;
    if (copies !== undefined) updateFields.copies = copies;
    if (available_copies !== undefined) updateFields.available_copies = available_copies;
    
    book = await Book.findByIdAndUpdate(
      bookId,
      updateFields,
      { new: true, runValidators: true }
    );
    
    res.status(200).json(book);
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
    
    const book = await getBookByIdInternal(bookId);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    await Book.findByIdAndDelete(bookId);
    
    // return res.status(204).json({message:'Book is deleted !!'});
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete book', error: error.message });
  }
};

export {
  addBook,
  getBookById,
  searchBooks,
  updateBook,
  deleteBook
};