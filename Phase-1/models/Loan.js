import mongoose from 'mongoose';

const LoanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  issue_date: {
    type: Date,
    default: Date.now
  },
  due_date: {
    type: Date,
    required: true
  },
  return_date: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'RETURNED', 'OVERDUE'],
    default: 'ACTIVE'
  },
  extensions_count: {
    type: Number,
    default: 0
  },
  original_due_date: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

const Loan = mongoose.model('Loan', LoanSchema);
export default Loan;