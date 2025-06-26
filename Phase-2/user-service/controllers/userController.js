// User Service: src/controllers/userController.js
import mongoose from 'mongoose';
import User from '../models/User.js';

// Create a new user
const createUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    const user = await User.create({ name, email, role: role || 'student' });
    
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create user', error: error.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.createdAt,
      updated_at: user.updatedAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user', error: error.message });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, role } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (role) updateFields.role = role;
    
    user = await User.findByIdAndUpdate(
      userId,
      updateFields,
      { new: true }
    );
    
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.createdAt,
      updated_at: user.updatedAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user', error: error.message });
  }
};

// Get all users (with optional search)
const getUsers = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    const users = await User.find(query);
    
    const formattedUsers = users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }));
    
    res.status(200).json(formattedUsers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};

export {
  createUser,
  getUserById,
  updateUser,
  getUsers
};