// controllers/loanController.js - Loan controller functions
import mongoose from 'mongoose';
import Loan from '../models/Loan.js';
import { getUserByIdInternal, getUsersByIdsInternal, countUsersInternal, validateUserIdInternal } from '../controllers/userController.js';
import { getBookByIdInternal, updateBookCopies, checkBookAvailability, validateBookIdInternal, getBookInventoryStats } from '../controllers/bookController.js';


// Utility method (not route handler)
export const validateLoanIdInternal = (loan_id) => {
  return mongoose.Types.ObjectId.isValid(loan_id);
};
// Issue a book to a user
const issueBook = async (req, res) => {
  try {
    const { user_id, book_id, due_date } = req.body;
    
    if (!user_id || !book_id || !due_date) {
      return res.status(400).json({ message: 'User ID, Book ID, and due date are required' });
    }
    
    if (!validateUserIdInternal(user_id) || !validateBookIdInternal(book_id)) {
      return res.status(400).json({ message: 'Invalid user or book ID' });
    }
    
    // Check if user exists
    const user = await getUserByIdInternal(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if book exists and is available
    const bookStatus = await checkBookAvailability(book_id);
    if (!bookStatus.exists) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    if (!bookStatus.available) {
      return res.status(400).json({ message: 'Book is not available for loan' });
    }
    
    // Create the loan
    const loan = await Loan.create({
      user: user_id,
      book: book_id,
      issue_date: new Date(),
      due_date: new Date(due_date),
      status: 'ACTIVE'
    });
    
    // Update book available copies
    await updateBookCopies(book_id, -1);
    
    res.status(201).json({
      id: loan._id,
      user_id: user_id,
      book_id: book_id,
      issue_date: loan.issue_date,
      due_date: loan.due_date,
      status: loan.status
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to issue book', error: error.message });
  }
};

// Return a borrowed book
const returnBook = async (req, res) => {
  try {
    const { loan_id } = req.body;
    
    if (!loan_id) {
      return res.status(400).json({ message: 'Loan ID is required' });
    }
    
    if (!validateLoanIdInternal(loan_id)) {
      return res.status(400).json({ message: 'Invalid loan ID' });
    }
    
    const loan = await Loan.findById(loan_id);
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }
    
    if (loan.status === 'RETURNED') {
      return res.status(400).json({ message: 'This book has already been returned' });
    }

    const book = await getBookByIdInternal(loan.book);
    if (!book) {
      return res.status(404).json({ message: 'Book not found for this loan' });
    }
    
    // Update the loan
    loan.return_date = new Date();
    loan.status = 'RETURNED';
    await loan.save();
    
    // Update the book's available copies
    await updateBookCopies(loan.book._id, 1);
    
    res.status(200).json({
      id: loan._id,
      user_id: loan.user,
      book_id: book._id,
      issue_date: loan.issue_date,
      due_date: loan.due_date,
      return_date: loan.return_date,
      status: loan.status
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to return book', error: error.message });
  }
};

// View loan history for a user
const getUserLoans = async (req, res) => {
  try {
    const userId = req.params.user_id;

    if (!validateUserIdInternal(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await getUserByIdInternal(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const loans = await Loan.find({ user: userId }).sort({ issue_date: -1 });

    const formattedLoans = await Promise.all(
      loans.map(async (loan) => {
        const book = await getBookByIdInternal(loan.book);

        return {
          id: loan._id,
          book: book
            ? {
                id: book._id,
                title: book.title,
                author: book.author
              }
            : null,
          issue_date: loan.issue_date,
          due_date: loan.due_date,
          return_date: loan.return_date,
          status: loan.status
        };
      })
    );

    res.status(200).json(formattedLoans);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch user loans',
      error: error.message
    });
  }
};


// List all overdue loans
const getOverdueLoans = async (req, res) => {
  try {
    const today = new Date();

    const overdueLoans = await Loan.find({
      due_date: { $lt: today },
      status: 'ACTIVE'
    });

    const formattedLoans = await Promise.all(
      overdueLoans.map(async (loan) => {
        const user = await getUserByIdInternal(loan.user);
        const book = await getBookByIdInternal(loan.book);

        const dueDate = new Date(loan.due_date);
        const diffTime = Math.abs(today - dueDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return {
          id: loan._id,
          user: user
            ? {
                id: user._id,
                name: user.name,
                email: user.email
              }
            : null,
          book: book
            ? {
                id: book._id,
                title: book.title,
                author: book.author
              }
            : null,
          issue_date: loan.issue_date,
          due_date: loan.due_date,
          days_overdue: diffDays
        };
      })
    );

    res.status(200).json(formattedLoans);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch overdue loans', error: error.message });
  }
};


// Extend the due date for a loan
const extendLoan = async (req, res) => {
  try {
    const loanId = req.params.id;
    const { extension_days } = req.body;
    
    if (!validateLoanIdInternal(loanId)) {
      return res.status(400).json({ message: 'Invalid loan ID' });
    }
    
    if (!extension_days || extension_days <= 0) {
      return res.status(400).json({ message: 'Valid extension days are required' });
    }
    
    const loan = await Loan.findById(loanId);
    
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }
    
    if (loan.status !== 'ACTIVE') {
      return res.status(400).json({ message: 'Only active loans can be extended' });
    }
    
    // Store original due date if this is the first extension
    const originalDueDate = loan.original_due_date || loan.due_date;
    
    // Calculate new due date
    const currentDueDate = new Date(loan.due_date);
    const newDueDate = new Date(currentDueDate);
    newDueDate.setDate(newDueDate.getDate() + extension_days);
    
    loan.original_due_date = originalDueDate;
    loan.due_date = newDueDate;
    loan.extensions_count += 1;
    await loan.save();
    
    res.status(200).json({
      id: loan._id,
      user_id: loan.user,
      book_id: loan.book,
      issue_date: loan.issue_date,
      original_due_date: originalDueDate,
      extended_due_date: newDueDate,
      status: loan.status,
      extensions_count: loan.extensions_count
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to extend loan', error: error.message });
  }
};

// Get the most popular books
const getPopularBooks = async (req, res) => {
  try {
    // Step 1: Get top 10 borrowed book IDs with borrow counts
    const borrowStats = await Loan.aggregate([
      {
        $group: {
          _id: '$book',
          borrow_count: { $sum: 1 }
        }
      },
      { $sort: { borrow_count: -1 } },
      { $limit: 10 }
    ]);

    // Step 2: Attach book info manually
    const results = await Promise.all(
      borrowStats.map(async (item) => {
        const book = await getBookByIdInternal(item._id);
        if (!book) return null;

        return {
          book_id: book._id,
          title: book.title,
          author: book.author,
          borrow_count: item.borrow_count
        };
      })
    );

    // Filter out any null entries (e.g. book no longer exists)
    const filtered = results.filter(item => item !== null);

    res.status(200).json(filtered);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch popular books',
      error: error.message
    });
  }
};

// Get the most active users
const getActiveUsers = async (req, res) => {
  try {
    // Get total borrows per user
    const userBorrows = await Loan.aggregate([
      { $group: {
        _id: '$user',
        books_borrowed: { $sum: 1 }
      }},
      { $sort: { books_borrowed: -1 } },
      { $limit: 10 }
    ]);
    
    // Get IDs of users with most borrows
    const userIds = userBorrows.map(item => item._id);
    
    // Get active borrows for these users
    const activeBorrows = await Loan.aggregate([
      { $match: {
        user: { $in: userIds },
        status: 'ACTIVE'
      }},
      { $group: {
        _id: '$user',
        current_borrows: { $sum: 1 }
      }}
    ]);
    
    // Create a map of user ID to active borrows
    const activeMap = new Map();
    activeBorrows.forEach(item => {
      activeMap.set(item._id.toString(), item.current_borrows);
    });
    
    // Get user details
    const users = await getUsersByIdsInternal(userIds);
    const userMap = new Map();
    users.forEach(user => {
      userMap.set(user._id.toString(), { name: user.name });
    });
    
    // Format the response
    const formatted = userBorrows.map(item => {
      const userId = item._id.toString();
      const user = userMap.get(userId) || {};
      return {
        user_id: item._id,
        name: user.name || 'Unknown User',
        books_borrowed: item.books_borrowed,
        current_borrows: activeMap.get(userId) || 0
      };
    });
    
    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch active users', error: error.message });
  }
};

// Get system overview statistics
const getSystemStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Get book stats from bookController
    const { total_books, books_available } = await getBookInventoryStats();
    const books_borrowed = total_books - books_available;
    
    // Total users
    const totalUsers = await countUsersInternal();
    
    // Overdue loans
    const overdueLoans = await Loan.countDocuments({
      due_date: { $lt: today },
      status: 'ACTIVE'
    });
    
    // Loans today
    const loansToday = await Loan.countDocuments({
      issue_date: { $gte: today, $lt: tomorrow }
    });
    
    // Returns today
    const returnsToday = await Loan.countDocuments({
      return_date: { $gte: today, $lt: tomorrow }
    });
    
    res.status(200).json({
      total_books: total_books,
      total_users: totalUsers,
      books_available: books_available,
      books_borrowed: books_borrowed,
      overdue_loans: overdueLoans,
      loans_today: loansToday,
      returns_today: returnsToday
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch system statistics', error: error.message });
  }
};

export {
  issueBook,
  returnBook,
  getUserLoans,
  getOverdueLoans,
  extendLoan,
  getPopularBooks,
  getActiveUsers,
  getSystemStats
};