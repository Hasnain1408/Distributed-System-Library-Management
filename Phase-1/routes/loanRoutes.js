import express from 'express';
import {
  issueBook,
  returnBook,
  getUserLoans,
  getOverdueLoans,
  extendLoan,
  getPopularBooks,
  getActiveUsers,
  getSystemStats
} from '../controllers/loanController.js';

const router = express.Router();

// Issue a book
router.post('/', issueBook);

// Return a book
router.post('/returns', returnBook);
// router.post('/returns/:loan_id', returnBook);

// Get overdue loans
router.get('/overdue', getOverdueLoans);


// Stats routes
router.get('/books/popular', getPopularBooks);
router.get('/users/active', getActiveUsers); 
router.get('/overview', getSystemStats);


// Get user's loans
router.get('/:user_id', getUserLoans);

// Extend loan
router.put('/:id/extend', extendLoan);

export default router;

