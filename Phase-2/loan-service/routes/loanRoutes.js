// Loan Service: src/routes/loanRoutes.js
import express from 'express';
import {
  issueBook,
  returnBook,
  getUserLoans,
  getLoanById,
  getOverdueLoans
} from '../controllers/loanController.js';

const router = express.Router();

// Loan endpoints
router.post('/', issueBook);
router.get('/user/:user_id', getUserLoans);
router.get('/overdue', getOverdueLoans);
router.get('/:id', getLoanById);

// Return endpoint
router.post('/returns', returnBook);

export default router;