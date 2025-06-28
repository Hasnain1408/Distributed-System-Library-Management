// Book Service: src/models/Book.js
import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Please add an author'],
    trim: true
  },
  isbn: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  copies: {
    type: Number,
    default: 1,
    min: [0, 'Number of copies cannot be negative']
  },
  available_copies: {
    type: Number,
    default: 1,
    min: [0, 'Available copies cannot be negative']
  }
}, {
  timestamps: true
});

const Book = mongoose.model('Book', BookSchema);
export default Book;