// API Gateway: src/index.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Service URLs (should be in environment variables in production)
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-service:8081';
const BOOK_SERVICE_URL = process.env.BOOK_SERVICE_URL || 'http://book-service:8082';
const LOAN_SERVICE_URL = process.env.LOAN_SERVICE_URL || 'http://loan-service:8083';

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'API Gateway' });
});

// Proxy middleware options
const proxyOptions = {
  changeOrigin: true,
  pathRewrite: {
    '^/api/users': '/api/users',
    '^/api/books': '/api/books',
    '^/api/loans': '/api/loans'
  },
  onError: (err, req, res) => {
    res.status(503).json({ 
      message: 'Service unavailable', 
      service: req.path.startsWith('/api/users') ? 'User Service' : 
               req.path.startsWith('/api/books') ? 'Book Service' : 
               req.path.startsWith('/api/loans') ? 'Loan Service' : 'Unknown Service'
    });
  }
};

// Proxy routes to appropriate services
app.use('/api/users', createProxyMiddleware({ 
  ...proxyOptions,
  target: USER_SERVICE_URL 
}));

app.use('/api/books', createProxyMiddleware({ 
  ...proxyOptions,
  target: BOOK_SERVICE_URL 
}));

app.use('/api/loans', createProxyMiddleware({ 
  ...proxyOptions,
  target: LOAN_SERVICE_URL 
}));

// Error handling for invalid routes
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`✅ API Gateway running on port ${PORT}`);
  console.log(`✅ Routing to services:`);
  console.log(`   - User Service: ${USER_SERVICE_URL}`);
  console.log(`   - Book Service: ${BOOK_SERVICE_URL}`);
  console.log(`   - Loan Service: ${LOAN_SERVICE_URL}`);
});

export default app;