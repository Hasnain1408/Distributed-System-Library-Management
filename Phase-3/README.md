# Library Management System - Reverse Proxy with Nginx

## System Architecture

The system follows a **microservices architecture** pattern, decomposing the application into three independent, loosely-coupled services:

```
┌─────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│   User Service  │    │   Book Service   │    │   Loan Service   │
│     (Port 8081) │    │     (Port 8082)  │    │     (Port 8083)  │
└─────────────────┘    └──────────────────┘    └──────────────────┘
         │                        │                        │
         └────────────────────────┼────────────────────────┘
                                  │
                    ┌─────────────────────────┐
                    │    Nginx Reverse Proxy  │
                    │       (Port 8080/443)   │
                    └─────────────────────────┘
```
## Phase 3: Nginx Reverse Proxy Implementation

### Objectives
- Implement Nginx as a single entry point for all API requests
- Configure path-based routing to backend services
- Enable SSL termination and HTTPS support
- Implement centralized logging and error handling
- Serve static content for frontend applications

### Nginx Configuration Strategy
```nginx
# Path-based routing configuration
location /api/users/ {
    proxy_pass http://user-service:8081/api/users/;
}

location /api/books/ {
    proxy_pass http://book-service:8082/api/books/;
}

location /api/loans/ {
    proxy_pass http://loan-service:8083/api/loans/;
}
```

### Key Features
- **Load Balancing**: Distribute requests across multiple service instances
- **SSL Termination**: Handle HTTPS encryption/decryption at the proxy level
- **Request/Response Modification**: Add headers, modify content as needed
- **Caching**: Implement response caching for improved performance
- **Rate Limiting**: Protect backend services from excessive requests
### Service Responsibilities

#### 1. User Service (Port 8081)
- **Domain**: User management and authentication
- **Responsibilities**:
  - User registration and profile management
  - User authentication and authorization
  - Role-based access control (student, librarian, admin)
  - User data persistence and retrieval

#### 2. Book Service (Port 8082)
- **Domain**: Book catalog and inventory management
- **Responsibilities**:
  - Book catalog management (CRUD operations)
  - Inventory tracking and availability management
  - Book search and filtering capabilities
  - ISBN validation and duplicate prevention
  - Statistical reporting on book inventory

#### 3. Loan Service (Port 8083)
- **Domain**: Book lending and return management
- **Responsibilities**:
  - Loan transaction processing
  - Due date management and overdue tracking
  - Inter-service communication with User and Book services
  - Loan history and reporting
  - Business logic for lending rules and policies

## Technical Stack

### Backend Technologies
- **Runtime**: Node.js with Express.js framework
- **Database**: MongoDB with Mongoose ODM
- **Inter-service Communication**: HTTP/REST APIs using Axios
- **Environment Management**: dotenv for configuration
- **CORS**: Cross-Origin Resource Sharing support

### Infrastructure
- **Reverse Proxy**: Nginx for request routing and load balancing


## API Specification

### User Service API (`/api/users`)

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| POST | `/` | Create new user | `{name, email, role}` |
| GET | `/:id` | Get user by ID | - |
| PUT | `/:id` | Update user | `{name?, email?, role?}` |
| GET | `/` | Get all users | Query: `?search=term` |

### Book Service API (`/api/books`)

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| POST | `/` | Add new book | `{title, author, isbn?, copies?}` |
| GET | `/:id` | Get book by ID | - |
| PUT | `/:id` | Update book | `{title?, author?, isbn?, copies?}` |
| DELETE | `/:id` | Delete book | - |
| GET | `/search` | Search books | Query: `?search=term&page=1&per_page=10` |
| PATCH | `/:id/availability` | Update availability | `{operation: 'increment'|'decrement'}` |
| GET | `/stats` | Get inventory statistics | - |

### Loan Service API (`/api/loans`)

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| POST | `/` | Create new loan | `{user_id, book_id, due_date}` |
| POST | `/returns` | Return book | `{loan_id}` |
| GET | `/user/:user_id` | Get user's loans | - |
| GET | `/:id` | Get loan by ID | - |
| GET | `/overdue` | Get overdue loans | - |

## Data Models

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  role: String (enum: ['student', 'librarian', 'admin'], default: 'student'),
  createdAt: Date,
  updatedAt: Date
}
```

### Book Model
```javascript
{
  title: String (required),
  author: String (required),
  isbn: String (unique, optional),
  copies: Number (default: 1),
  available_copies: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Loan Model
```javascript
{
  user_id: ObjectId (required),
  book_id: ObjectId (required),
  issue_date: Date (default: now),
  due_date: Date (required),
  return_date: Date (optional),
  status: String (enum: ['ACTIVE', 'RETURNED', 'OVERDUE']),
  createdAt: Date,
  updatedAt: Date
}
```

## Inter-Service Communication

The system implements **synchronous communication** patterns using HTTP/REST APIs:

1. **Service Discovery**: Static configuration using environment variables
2. **API Gateway Pattern**: Nginx serves as the API gateway for external clients
3. **Circuit Breaker**: Basic error handling with service unavailability responses
4. **Data Consistency**: Eventual consistency through compensating transactions

### Communication Flow Example: Creating a Loan

```
1. Client → Nginx → Loan Service
2. Loan Service → User Service (validate user exists)
3. Loan Service → Book Service (validate book availability)
4. Loan Service → Book Service (decrement available copies)
5. Loan Service → Database (create loan record)
6. Loan Service → Client (return loan details)
```



## Installation and Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Nginx (v1.18 or higher)
- Git for version control



## Testing Strategy

### Unit Testing
- Service-specific business logic testing
- Data model validation testing
- Error handling and edge cases

### Integration Testing
- Inter-service communication testing
- Database integration testing
- API endpoint testing with various payloads

### End-to-End Testing
- Complete user workflows
- Error scenarios and recovery
- Performance and load testing



## Future Enhancements

1. **Event-Driven Architecture**: Implement message queues (RabbitMQ/Apache Kafka)
2. **Containerization**: Full Docker containerization with orchestration
3. **Service Mesh**: Implement Istio for advanced traffic management
4. **API Versioning**: Support multiple API versions
5. **Real-time Notifications**: WebSocket-based notifications
6. **Advanced Search**: Elasticsearch integration for complex queries
7. **Reporting Dashboard**: Analytics and reporting interface
