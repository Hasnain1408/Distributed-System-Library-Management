// Loan Service: src/models/Loan.js
import mongoose from 'mongoose';

const LoanSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: [true, 'User ID is required']
  },
  book_id: {
    type: String,
    required: [true, 'Book ID is required']
  },
  issue_date: {
    type: Date,
    default: Date.now
  },
  due_date: {
    type: Date,
    required: [true, 'Due date is required']
  },
  return_date: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'RETURNED', 'OVERDUE'],
    default: 'ACTIVE'
  }
}, {
  timestamps: true
});

// Add an index to improve query performance for user loans
LoanSchema.index({ user_id: 1 });
LoanSchema.index({ book_id: 1 });
LoanSchema.index({ status: 1 });

const Loan = mongoose.model('Loan', LoanSchema);
export default Loan;