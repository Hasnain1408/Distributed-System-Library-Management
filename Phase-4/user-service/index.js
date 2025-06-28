// User Service: src/index.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'User Service' });
});

// Routes
app.use('/api/users', userRoutes);

// Error handling for invalid routes
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log(`✅ User Service running on port ${PORT}`);
});

export default app;