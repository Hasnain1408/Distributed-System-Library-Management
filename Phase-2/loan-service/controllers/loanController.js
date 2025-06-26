// Loan Service: src/controllers/loanController.js
import mongoose from 'mongoose';
import axios from 'axios';
import Loan from '../models/Loan.js';

// Service URLs (should be in environment variables in production)
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-service:8081/api/users';
const BOOK_SERVICE_URL = process.env.BOOK_SERVICE_URL || 'http://book-service:8082/api/books';

// Helper function to check if user exists
const validateUser = async (userId) => {
  try {
    const response = await axios.get(`${USER_SERVICE_URL}/${userId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error('User not found');
    }
    if (error.response && error.response.status === 400) {
      throw new Error('Invalid user ID');
    }
    throw new Error('User service unavailable');
  }
};

// Helper function to check book availability
const validateBook = async (bookId) => {
  try {
    const response = await axios.get(`${BOOK_SERVICE_URL}/${bookId}`);
    const book = response.data;
    
    if (book.available_copies <= 0) {
      throw new Error('No available copies of this book');
    }
    
    return book;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error('Book not found');
    }
    if (error.response && error.response.status === 400) {
      throw new Error('Invalid book ID');
    }
    if (error.message === 'No available copies of this book') {
      throw error;
    }
    throw new Error('Book service unavailable');
  }
};

// Helper function to update book availability
const updateBookAvailability = async (bookId, operation) => {
  try {
    const response = await axios.patch(
      `${BOOK_SERVICE_URL}/${bookId}/availability`,
      { operation }
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update book availability: ${error.message}`);
  }
};

// Create a new loan (issue a book)
const issueBook = async (req, res) => {
  try {
    const { user_id, book_id, due_date } = req.body;
    
    if (!user_id || !book_id || !due_date) {
      return res.status(400).json({ message: 'User ID, book ID, and due date are required' });
    }
    
    // Validate user_id and book_id format
    if (!mongoose.Types.ObjectId.isValid(user_id) || !mongoose.Types.ObjectId.isValid(book_id)) {
      return res.status(400).json({ message: 'Invalid user ID or book ID format' });
    }
    
    try {
      // Check if user exists
      const user = await validateUser(user_id);
      
      // Check if book exists and is available
      const book = await validateBook(book_id);
      
      // Check if user already has this book loaned
      const existingLoan = await Loan.findOne({
        user_id,
        book_id,
        status: 'ACTIVE'
      });
      
      if (existingLoan) {
        return res.status(400).json({ message: 'User already has this book on loan' });
      }
      
      // Update book availability (decrement available copies)
      await updateBookAvailability(book_id, 'decrement');
      
      // Create new loan
      const loan = await Loan.create({
        user_id,
        book_id,
        due_date: new Date(due_date),
        status: 'ACTIVE'
      });
      
      return res.status(201).json({
        id: loan._id,
        user_id: loan.user_id,
        book_id: loan.book_id,
        issue_date: loan.issue_date,
        due_date: loan.due_date,
        status: loan.status
      });
      
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ message: error.message });
      }
      if (error.message === 'Book not found' || error.message === 'No available copies of this book') {
        return res.status(400).json({ message: error.message });
      }
      if (error.message === 'User service unavailable' || error.message === 'Book service unavailable') {
        return res.status(503).json({ message: error.message });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error creating loan:', error);
    return res.status(500).json({ message: 'Failed to create loan', error: error.message });
  }
};

// Return a book
const returnBook = async (req, res) => {
  try {
    const { loan_id } = req.body;
    
    if (!loan_id) {
      return res.status(400).json({ message: 'Loan ID is required' });
    }
    
    if (!mongoose.Types.ObjectId.isValid(loan_id)) {
      return res.status(400).json({ message: 'Invalid loan ID format' });
    }
    
    // Find the loan
    const loan = await Loan.findById(loan_id);
    
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }
    
    if (loan.status === 'RETURNED') {
      return res.status(400).json({ message: 'This book has already been returned' });
    }
    
    try {
      // Update book availability (increment available copies)
      await updateBookAvailability(loan.book_id, 'increment');
      
      // Update loan status and return date
      loan.status = 'RETURNED';
      loan.return_date = new Date();
      await loan.save();
      
      return res.status(200).json({
        id: loan._id,
        user_id: loan.user_id,
        book_id: loan.book_id,
        issue_date: loan.issue_date,
        due_date: loan.due_date,
        return_date: loan.return_date,
        status: loan.status
      });
      
    } catch (error) {
      if (error.message.includes('Failed to update book availability')) {
        return res.status(503).json({ message: 'Book service unavailable' });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error returning book:', error);
    return res.status(500).json({ message: 'Failed to return book', error: error.message });
  }
};

// Get loans by user ID
const getUserLoans = async (req, res) => {
  try {
    const { user_id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    
    // Check if user exists
    try {
      await validateUser(user_id);
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ message: error.message });
      }
      if (error.message === 'User service unavailable') {
        return res.status(503).json({ message: error.message });
      }
    }
    
    // Get all loans for this user
    const loans = await Loan.find({ user_id }).sort({ createdAt: -1 });
    
    // Get book details for each loan
    const loansWithDetails = await Promise.all(
      loans.map(async (loan) => {
        let bookDetails = { id: loan.book_id, title: 'Unknown', author: 'Unknown' };
        
        try {
          const bookResponse = await axios.get(`${BOOK_SERVICE_URL}/${loan.book_id}`);
          const book = bookResponse.data;
          bookDetails = {
            id: book.id,
            title: book.title,
            author: book.author
          };
        } catch (error) {
          console.error(`Failed to fetch book details for book ID ${loan.book_id}:`, error.message);
        }
        
        return {
          id: loan._id,
          book: bookDetails,
          issue_date: loan.issue_date,
          due_date: loan.due_date,
          return_date: loan.return_date,
          status: loan.status
        };
      })
    );
    
    return res.status(200).json({
      loans: loansWithDetails,
      total: loans.length
    });
  } catch (error) {
    console.error('Error getting user loans:', error);
    return res.status(500).json({ message: 'Failed to get user loans', error: error.message });
  }
};

// Get loan by ID
const getLoanById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid loan ID format' });
    }
    
    const loan = await Loan.findById(id);
    
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }
    
    let userDetails = { id: loan.user_id, name: 'Unknown', email: 'Unknown' };
    let bookDetails = { id: loan.book_id, title: 'Unknown', author: 'Unknown' };
    
    try {
      // Get user details
      const userResponse = await axios.get(`${USER_SERVICE_URL}/${loan.user_id}`);
      const user = userResponse.data;
      userDetails = {
        id: user.id,
        name: user.name,
        email: user.email
      };
    } catch (error) {
      console.error(`Failed to fetch user details for user ID ${loan.user_id}:`, error.message);
    }
    
    try {
      // Get book details
      const bookResponse = await axios.get(`${BOOK_SERVICE_URL}/${loan.book_id}`);
      const book = bookResponse.data;
      bookDetails = {
        id: book.id,
        title: book.title,
        author: book.author
      };
    } catch (error) {
      console.error(`Failed to fetch book details for book ID ${loan.book_id}:`, error.message);
    }
    
    return res.status(200).json({
      id: loan._id,
      user: userDetails,
      book: bookDetails,
      issue_date: loan.issue_date,
      due_date: loan.due_date,
      return_date: loan.return_date,
      status: loan.status
    });
  } catch (error) {
    console.error('Error getting loan details:', error);
    return res.status(500).json({ message: 'Failed to get loan details', error: error.message });
  }
};

// Get all overdue loans
const getOverdueLoans = async (req, res) => {
  try {
    const now = new Date();
    
    // Find loans where due date is past and status is still ACTIVE
    const overdueLoans = await Loan.find({
      due_date: { $lt: now },
      status: 'ACTIVE'
    }).sort({ due_date: 1 });
    
    // Update status to OVERDUE for all found loans
    await Loan.updateMany(
      { _id: { $in: overdueLoans.map(loan => loan._id) } },
      { status: 'OVERDUE' }
    );
    
    // Return updated overdue loans with book and user details
    const loansWithDetails = await Promise.all(
      overdueLoans.map(async (loan) => {
        let userDetails = { id: loan.user_id, name: 'Unknown', email: 'Unknown' };
        let bookDetails = { id: loan.book_id, title: 'Unknown', author: 'Unknown' };
        
        try {
          const userResponse = await axios.get(`${USER_SERVICE_URL}/${loan.user_id}`);
          userDetails = {
            id: userResponse.data.id,
            name: userResponse.data.name,
            email: userResponse.data.email
          };
        } catch (error) {
          console.error(`Failed to fetch user details for user ID ${loan.user_id}:`, error.message);
        }
        
        try {
          const bookResponse = await axios.get(`${BOOK_SERVICE_URL}/${loan.book_id}`);
          bookDetails = {
            id: bookResponse.data.id,
            title: bookResponse.data.title,
            author: bookResponse.data.author
          };
        } catch (error) {
          console.error(`Failed to fetch book details for book ID ${loan.book_id}:`, error.message);
        }
        
        return {
          id: loan._id,
          user: userDetails,
          book: bookDetails,
          issue_date: loan.issue_date,
          due_date: loan.due_date,
          days_overdue: Math.floor((now - loan.due_date) / (1000 * 60 * 60 * 24)),
          status: 'OVERDUE'
        };
      })
    );
    
    return res.status(200).json({
      overdue_loans: loansWithDetails,
      total: overdueLoans.length
    });
  } catch (error) {
    console.error('Error getting overdue loans:', error);
    return res.status(500).json({ message: 'Failed to get overdue loans', error: error.message });
  }
};

export {
  issueBook,
  returnBook,
  getUserLoans,
  getLoanById,
  getOverdueLoans
};