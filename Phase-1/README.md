# 📚 Smart Library System - Monolithic Architecture

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-PostgreSQL-blue.svg)](https://postgresql.org/)
[![API](https://img.shields.io/badge/API-REST-orange.svg)](https://restfulapi.net/)

## 🎯 Overview

The Smart Library System is a comprehensive monolithic application designed to manage library operations efficiently. It provides a unified solution for managing users, books, and loan transactions through a single, cohesive system.

### Key Features

- 👥 **User Management** - Register and manage students and faculty
- 📖 **Book Catalog** - Comprehensive book inventory management
- 🔄 **Loan System** - Track book borrowing and returns
- 📊 **Analytics** - Usage statistics and reporting
- 🔍 **Search** - Advanced book search capabilities
- ⏰ **Overdue Tracking** - Monitor and manage overdue loans

## 🏗️ Architecture

This monolithic system consolidates all functionality into a single application with shared resources:

```
┌─────────────────────────────────────┐
│         Smart Library System        │
├─────────────────────────────────────┤
│  ┌─────────┐ ┌─────────┐ ┌─────────┐│
│  │  User   │ │  Book   │ │  Loan   ││
│  │ Module  │ │ Module  │ │ Module  ││
│  └─────────┘ └─────────┘ └─────────┘│
├─────────────────────────────────────┤
│                Database             │
│         (PostgreSQL/MongoDB)        │
└─────────────────────────────────────┘
```

## 🧩 Functional Modules

### 1. User Management Module
- Register new users (students/faculty)
- Update user profiles
- Retrieve user information
- Manage user roles and permissions

### 2. Book Management Module
- Add, update, and remove books
- Track book availability
- Search books by multiple criteria
- Manage book categories and genres

### 3. Loan Management Module
- Issue books to users
- Process book returns
- Track loan history
- Handle loan extensions
- Monitor overdue items

## 🛢️ Database Schema

| Table | Description | Key Fields |
|-------|-------------|------------|
| `users` | Store user information | `id`, `name`, `email`, `role`, `created_at` |
| `books` | Book catalog details | `id`, `title`, `author`, `isbn`, `copies`, `available_copies` |
| `loans` | Track issued/returned books | `id`, `user_id`, `book_id`, `issue_date`, `due_date`, `status` |

### Entity Relationships

```sql
users (1) -----> (N) loans (N) <----- (1) books
```

## 🚀 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
All endpoints require appropriate authentication headers:
```http
Authorization: Bearer <your-token>
Content-Type: application/json
```

## 📋 API Endpoints

### 👥 User Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `POST` | `/api/users` | Create new user | `{"name": "string", "email": "string", "role": "string"}` |
| `GET` | `/api/users/{id}` | Get user by ID | - |
| `PUT` | `/api/users/{id}` | Update user | `{"name": "string", "email": "string"}` |
| `DELETE` | `/api/users/{id}` | Delete user | - |

### 📚 Book Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `POST` | `/api/books` | Add new book | `{"title": "string", "author": "string", "isbn": "string", "copies": number}` |
| `GET` | `/api/books` | List all books | Query: `?search=keyword&limit=10&offset=0` |
| `GET` | `/api/books/{id}` | Get book details | - |
| `PUT` | `/api/books/{id}` | Update book | `{"copies": number, "available_copies": number}` |
| `DELETE` | `/api/books/{id}` | Remove book | - |

### 🔄 Loan Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `POST` | `/api/loans` | Issue book | `{"user_id": number, "book_id": number, "due_date": "ISO date"}` |
| `POST` | `/api/returns` | Return book | `{"loan_id": number}` |
| `GET` | `/api/loans/{user_id}` | Get user's loans | - |
| `GET` | `/api/loans/overdue` | List overdue loans | - |
| `PUT` | `/api/loans/{id}/extend` | Extend loan | `{"extension_days": number}` |

### 📊 Statistics Endpoints

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| `GET` | `/api/stats/books/popular` | Most borrowed books | Array of popular books |
| `GET` | `/api/stats/users/active` | Most active users | Array of active users |
| `GET` | `/api/stats/overview` | System overview | System statistics object |

## 💻 Installation & Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL 12+ or MySQL 8+
- npm or yarn package manager

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/smart-library-system.git
   cd smart-library-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Setup database**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. **Start the application**
   ```bash
   npm run dev
   ```

### Environment Variables

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smart_library
DB_USER=your_username
DB_PASSWORD=your_password

# Application Configuration
PORT=3000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key

# Logging
LOG_LEVEL=info
```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run integration tests
npm run test:integration
```

### API Testing with cURL

**Create a user:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice Smith", "email": "alice@example.com", "role": "student"}'
```

**Add a book:**
```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title": "Clean Code", "author": "Robert C. Martin", "isbn": "9780132350884", "copies": 3}'
```

**Issue a book:**
```bash
curl -X POST http://localhost:3000/api/loans \
  -H "Content-Type: application/json" \
  -d '{"user_id": 1, "book_id": 1, "due_date": "2025-05-15T23:59:59Z"}'
```

## 📈 Response Examples

### Successful Book Creation
```json
{
  "success": true,
  "data": {
    "id": 42,
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "isbn": "9780132350884",
    "copies": 3,
    "available_copies": 3,
    "created_at": "2025-01-15T10:30:00Z"
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "BOOK_NOT_FOUND",
    "message": "Book with ID 999 not found",
    "details": {}
  }
}
```

## 🔧 Development

### Project Structure
```
smart-library-system/
├── src/
│   ├── controllers/     # Request handlers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   ├── utils/          # Utility functions
│   └── config/         # Configuration files
├── tests/              # Test files
├── docs/               # Documentation
├── migrations/         # Database migrations
└── seeds/              # Database seed files
```


## ⚠️ Limitations of Monolithic Architecture

| Limitation | Impact | Mitigation |
|------------|--------|------------|
| **Scaling Challenges** | Cannot scale individual components | Consider microservices for high-load scenarios |
| **Tight Coupling** | Changes affect entire system | Implement proper module boundaries |
| **Single Point of Failure** | One bug can crash entire app | Implement comprehensive error handling |
| **Technology Lock-in** | Uniform tech stack across modules | Plan for gradual migration if needed |
| **Team Coordination** | Harder with larger teams | Use feature flags and proper branching |


## 🔮 Future Enhancements

- [ ] **Microservices Migration** - Gradual transition to microservices
- [ ] **Real-time Notifications** - WebSocket integration for live updates
- [ ] **Mobile App** - React Native companion app
- [ ] **Advanced Analytics** - ML-powered recommendation system
- [ ] **Multi-library Support** - Support for multiple library branches
- [ ] **Digital Resources** - E-books and digital media management

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Made with ❤️ by the Smart Library Team**
