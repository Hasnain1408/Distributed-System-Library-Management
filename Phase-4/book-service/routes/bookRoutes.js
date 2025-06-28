// Book Service: src/routes/bookRoutes.js
import express from 'express';
import {
  addBook,
  getBookById,
  searchBooks,
  updateBook,
  deleteBook,
  updateBookAvailability,
  getBookInventoryStats
} from '../controllers/bookController.js';

const router = express.Router();

// Public API endpoints
router.post('/', addBook);
router.get('/search', searchBooks);
router.get('/stats', getBookInventoryStats);
router.get('/:id', getBookById);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);
router.patch('/:id/availability', updateBookAvailability);

export default router;