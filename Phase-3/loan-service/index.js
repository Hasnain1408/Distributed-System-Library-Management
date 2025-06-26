// Loan Service: src/index.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import loanRoutes from './routes/loanRoutes.js';

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
  res.status(200).json({ status: 'UP', service: 'Loan Service' });
});

// Routes
app.use('/api/loans', loanRoutes);

// Error handling for invalid routes
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

const PORT = process.env.PORT || 8083;

app.listen(PORT, () => {
  console.log(`✅ Loan Service running on port ${PORT}`);
});

export default app;