// User Service: src/routes/userRoutes.js
import express from 'express';
import { createUser, getUserById, updateUser, getUsers } from '../controllers/userController.js';

const router = express.Router();

// Public API endpoints
router.post('/', createUser);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.get('/', getUsers);

export default router;