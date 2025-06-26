import express from 'express';
import { addBook, searchBooks, getBookById, updateBook, deleteBook } from '../controllers/bookController.js';

const router = express.Router();

// Add a new book
router.post('/', addBook);

// Search books
router.get('/', searchBooks);

// Get book by ID
router.get('/:id', getBookById);

// Update book
router.put('/:id', updateBook);

// Delete book
router.delete('/:id', deleteBook);

export default router;