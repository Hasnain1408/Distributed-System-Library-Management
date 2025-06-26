# 📚 Smart Library System - Microservices Architecture

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Java](https://img.shields.io/badge/Java-17+-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.0+-green.svg)](https://spring.io/projects/spring-boot)
[![Docker](https://img.shields.io/badge/Docker-Containerized-blue.svg)](https://www.docker.com/)

## 🚀 Overview

The Smart Library System is a modern, cloud-native application built using microservices architecture. It demonstrates best practices in distributed systems design, featuring service isolation, independent databases, and RESTful API communication.

### 🎯 Key Features

- **🔐 User Management** - Registration, profiles, and authentication
- **📖 Book Catalog** - Inventory management and search capabilities
- **📋 Loan Processing** - Book borrowing and return workflows
- **🏗️ Microservices Architecture** - Independent, scalable services
- **📊 RESTful APIs** - Standard HTTP/JSON communication
- **🐳 Containerized Deployment** - Docker-ready services

## 🏛️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Service  │    │  Book Service   │    │  Loan Service   │
│                 │    │                 │    │                 │
│ 🚪 Port: 8081   │    │ 🚪 Port: 8082   │    │ 🚪 Port: 8083   │
│ 📦 user_db      │    │ 📦 book_db      │    │ 📦 loan_db      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   API Gateway   │
                    │   Port: 8080    │
                    └─────────────────┘
```

## 🧱 Services Overview

| Service | Port | Database | Responsibility |
|---------|------|----------|----------------|
| **User Service** | 8081 | `user_db` | User registration, profile management |
| **Book Service** | 8082 | `book_db` | Book inventory, search, availability |
| **Loan Service** | 8083 | `loan_db` | Book borrowing, returns, loan history |

## 🛠️ Technology Stack

- **Backend**: Node.JS
- **Database**: MongoDB/PostgreSQL / MySQL
- **Communication**: REST APIs, HTTP/JSON
- **Containerization**: Docker, Docker Compose
- **Build Tool**: Maven / Gradle
- **Documentation**: OpenAPI 3.0 (Swagger)

## 🚀 Quick Start

### Prerequisites

- Node.JS
- Docker & Docker Compose
- Maven 3.6+

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/smart-library-system.git
cd smart-library-system
```

### 2. Start with Docker Compose

```bash
# Start all services and databases
docker-compose up -d

# Check service health
docker-compose ps
```

### 3. Access the Services

| Service | URL | Documentation |
|---------|-----|---------------|
| User Service | http://localhost:8081 | http://localhost:8081/swagger-ui.html |
| Book Service | http://localhost:8082 | http://localhost:8082/swagger-ui.html |
| Loan Service | http://localhost:8083 | http://localhost:8083/swagger-ui.html |

## 📋 API Examples

### 👤 User Service

```bash
# Create a new user
curl -X POST http://localhost:8081/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Smith",
    "email": "alice@example.com",
    "role": "student"
  }'

# Get user by ID
curl http://localhost:8081/api/users/1
```

### 📚 Book Service

```bash
# Add a new book
curl -X POST http://localhost:8082/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "isbn": "9780132350884",
    "copies": 3
  }'

# Search books
curl "http://localhost:8082/api/books?search=clean"
```

### 📋 Loan Service

```bash
# Issue a book
curl -X POST http://localhost:8083/api/loans \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "book_id": 42,
    "due_date": "2025-06-03T23:59:59Z"
  }'

# Return a book
curl -X POST http://localhost:8083/api/returns \
  -H "Content-Type: application/json" \
  -d '{
    "loan_id": 1001
  }'
```


## 📊 Database Schema

### User Service Database

```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Book Service Database

```sql
CREATE TABLE books (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(20) UNIQUE,
    copies INTEGER NOT NULL DEFAULT 1,
    available_copies INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Loan Service Database

```sql
CREATE TABLE loans (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    issue_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP NOT NULL,
    return_date TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```


## 🧪 Testing

### Run Unit Tests

```bash
# Test all services
mvn test

# Test specific service
cd user-service && mvn test
cd book-service && mvn test
cd loan-service && mvn test
```

### Integration Tests

```bash
# Start test environment
docker-compose -f docker-compose.test.yml up -d

# Run integration tests
mvn verify
```

### API Testing with Postman

Import the provided Postman collection:
- `postman/Smart-Library-System.postman_collection.json`
- `postman/Smart-Library-System.postman_environment.json`

## 📈 Monitoring & Observability

### Health Checks

```bash
# Check service health
curl http://localhost:8081/actuator/health
curl http://localhost:8082/actuator/health
curl http://localhost:8083/actuator/health
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SERVER_PORT` | Service port | Service-specific |
| `SPRING_DATASOURCE_URL` | Database URL | - |
| `USER_SERVICE_URL` | User service endpoint | `http://localhost:8081` |
| `BOOK_SERVICE_URL` | Book service endpoint | `http://localhost:8082` |


## ✅ Advantages of This Architecture

- **🔄 Independent Development** - Teams can work on services simultaneously
- **🚀 Scalability** - Scale services independently based on demand  
- **🛡️ Fault Isolation** - Service failures don't cascade
- **🔧 Technology Flexibility** - Choose best tools for each service
- **📊 Clear Boundaries** - Well-defined service responsibilities

## ⚠️ Considerations

- **🌐 Network Latency** - Inter-service communication overhead
- **🔍 Distributed Tracing** - Complex debugging across services
- **📊 Data Consistency** - Managing consistency across boundaries
- **🎯 Service Discovery** - Services need to locate each other
- **⚙️ Operational Complexity** - More moving parts to manage


Made with ❤️ by the Smart Library Team
