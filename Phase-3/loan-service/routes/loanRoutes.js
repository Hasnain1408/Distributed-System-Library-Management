import express from 'express';
import {
  issueBook,
  returnBook,
  getLoanById,
  getUserLoans,
  getOverdueLoans,
  extendLoan
} from '../controllers/loanController.js';

const router = express.Router();

// Issue a book
router.post('/', issueBook);

// Return a book
router.post('/returns', returnBook);
// router.post('/returns/:loan_id', returnBook);

// Get overdue loans
router.get('/overdue', getOverdueLoans);



// Get user's loans
router.get('/:user_id', getUserLoans);

// Get loan by ID
router.get('/getLoan/:id', getLoanById);

// Extend loan
router.put('/:id/extend', extendLoan);

export default router;

