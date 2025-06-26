import express from 'express';
import { createUser, getUserById, updateUser } from '../controllers/userController.js';

const router = express.Router();

// Create a new user
router.post('/', createUser);

// Get user by ID
router.get('/:id', getUserById);

// Update user
router.put('/:id', updateUser);

// router.get('/', getUsers);

export default router;