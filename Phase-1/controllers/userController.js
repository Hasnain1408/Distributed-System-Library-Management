// controllers/userController.js - User controller functions
import mongoose from 'mongoose';
import User from '../models/User.js';



// Utility method (not route handler)
export const validateUserIdInternal = (user_id) => {
  return mongoose.Types.ObjectId.isValid(user_id);
};


// Utility method (not route handler)
export const getUserByIdInternal = async (user_id) => {
  if (!mongoose.Types.ObjectId.isValid(user_id)) return null;
  return await User.findById(user_id);
};

// Get users by IDs (utility function)
export const getUsersByIdsInternal = async (userIds) => {
  if (!userIds || userIds.length === 0) return [];
  return await User.find({ _id: { $in: userIds } });
};

// Count total users (utility function)
export const countUsersInternal = async () => {
  return await User.countDocuments();
};

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
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create user', error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    const user = await getUserByIdInternal(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user', error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, role } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    let user = await getUserByIdInternal(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (role) updateFields.role = role;
    
    user = await User.findByIdAndUpdate(userId, updateFields, { new: true });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user', error: error.message });
  }
};

export {
  createUser,
  getUserById,
  updateUser
};