# Smart Library System - Phase 4: Containerization with Docker

## 🐳 Phase 4: Containerization with Docker

We encapsulate each microservice into its own Docker container to achieve environment consistency and portability.

### 🎯 You'll Learn:

- Why containerization is essential in microservice ecosystems
- How to write Dockerfiles for Python, Node.js, Java, and .NET Core apps
- How to build and run containers
- Container networking and volume mounting

### 🛠 Topics Covered:

- Writing Dockerfiles for each service
- Installing dependencies inside containers
- Exposing ports and configuring environment variables
- Docker CLI basics: build, run, exec, logs
- Creating named networks for communication between services

---

## System Architecture

The system continues to follow a **microservices architecture** pattern, with all services containerized using Docker. The architecture includes a reverse proxy with Nginx and integration with a remote MongoDB Atlas database:

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
                    │       (Port 8080)       │
                    └─────────────────────────┘
                                  ↓
                        MongoDB Atlas (Cloud)
```

## Prerequisites

Before getting started, ensure you have the following installed on your system:

- Docker (latest version) installed on your system
- Docker Compose (latest version) installed on your system
- Node.js (v16 or higher)
- Git for version control
- MongoDB Atlas account with whitelisted IP

## Project Structure

Ensure your project directory is structured as follows:

```
smart-library-system/
├── user-service/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── package.json
│   ├── Dockerfile.user
├── loan-service/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── package.json
│   ├── Dockerfile.loan
├── book-service/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── package.json
│   ├── Dockerfile.book
├── config/
│   ├── nginx.conf
├── docker-compose.yml
├── .env
├── .gitignore
```

## Phase 4: Dockerized Microservices with MongoDB Atlas

### Objectives
- Fully containerize the application using Docker and Docker Compose
- Integrate MongoDB Atlas as the centralized database solution
- Enhance Nginx reverse proxy with secure routing and environment variable support
- Implement automated deployment and scaling capabilities
- Ensure secure handling of sensitive credentials

### Key Enhancements
- **Containerization**: All services (User, Book, Loan) and Nginx are containerized with Docker
- **Remote Database**: Replaced local MongoDB with MongoDB Atlas for scalability and accessibility
- **Environment Management**: Sensitive data (e.g., MongoDB URIs) stored in `.env` files, excluded from version control
- **Automated Builds**: Utilize `docker-compose up --build -d` for streamlined deployment
- **Network Configuration**: Custom Docker network (`library-network`) for inter-service communication

## Service Responsibilities

### 1. User Service (Port 8081)
- **Domain**: User management and authentication
- **Responsibilities**:
  - User registration, profile updates, and deletion
  - Authentication and role-based access control (student, librarian, admin)
  - Data persistence in MongoDB Atlas (`users` collection)

### 2. Book Service (Port 8082)
- **Domain**: Book catalog and inventory management
- **Responsibilities**:
  - CRUD operations for book catalog
  - Inventory tracking and availability management
  - Search, filtering, and statistical reporting
  - Data persistence in MongoDB Atlas (`bookdb` collection)

### 3. Loan Service (Port 8083)
- **Domain**: Book lending and return management
- **Responsibilities**:
  - Loan transaction processing and returns
  - Due date and overdue tracking
  - Inter-service communication with User and Book services
  - Data persistence in MongoDB Atlas (`loandb` collection)

## Technical Stack

### Backend Technologies
- **Runtime**: Node.js with Express.js framework
- **Database**: MongoDB Atlas with Mongoose ODM
- **Inter-service Communication**: HTTP/REST APIs using Axios
- **Environment Management**: dotenv for configuration
- **CORS**: Cross-Origin Resource Sharing support

### Infrastructure
- **Containerization**: Docker and Docker Compose
- **Reverse Proxy**: Nginx for request routing and load balancing
- **Network**: Custom Docker bridge network

## Setup Instructions

### 1. Clone or Update the Repository

- Ensure all service code (User, Loan, Book) is in their respective directories (`user-service`, `loan-service`, `book-service`)
- Copy the provided Dockerfiles, `docker-compose.yml`, and `nginx.conf` into the appropriate directories

### 2. Create Environment Configuration

Create a `.env` file in the project root:
```env
MONGO_URI_USER=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/users
MONGO_URI_LOAN=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/loandb
MONGO_URI_BOOK=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/bookdb
```
- Replace `<username>`, `<password>`, and `<cluster>` with your MongoDB Atlas credentials
- Add `.env` to `.gitignore` to exclude from version control

### 3. Build and Run Containers

Navigate to the project root directory and run:

```bash
docker-compose up --build
```

This command builds the Docker images for each service and starts the containers, including MongoDB and Nginx.

For background execution:
```bash
docker-compose up --build -d
```

### 4. Verify Installation

```bash
docker ps
curl http://localhost:8080/api/users/
```

## Access the Services

Once the containers are running, you can access the services at the following URLs:

- **User Service**: http://localhost:8080/api/users/
- **Loan Service**: http://localhost:8080/api/loans/
- **Book Service**: http://localhost:8080/api/books/
- **Nginx Gateway**: http://localhost:8080

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

## Docker CLI Commands

Here are some useful Docker commands for managing your containers:

### View running containers
```bash
docker ps
```

### Check container logs
Replace `<service>` with `user-service`, `loan-service`, `book-service`, `mongo`, or `nginx`:
```bash
docker-compose logs <service>
```

### Access a container's shell
```bash
docker exec -it <container_name> sh
```

### Stop all containers
```bash
docker-compose down
```

### Rebuild specific service
```bash
docker-compose up --build <service-name>
```

### View container resource usage
```bash
docker stats
```

## Network Configuration

All services are connected via a custom bridge network (`library-network`). Services can communicate using their service names (`user-service`, `loan-service`, `book-service`, `mongo`) as hostnames.

## Volume Configuration

MongoDB data is persisted in a Docker volume (`mongo-data`) to ensure data is retained between container restarts.

## Inter-Service Communication

The system implements **synchronous communication** patterns using HTTP/REST APIs:

1. **Service Discovery**: Static configuration via Docker service names
2. **API Gateway Pattern**: Nginx serves as the API gateway
3. **Circuit Breaker**: Basic error handling with 502 Bad Gateway responses
4. **Data Consistency**: Eventual consistency through MongoDB Atlas transactions

### Communication Flow Example: Creating a Loan

```
1. Client → Nginx → Loan Service
2. Loan Service → User Service (validate user exists)
3. Loan Service → Book Service (validate book availability)
4. Loan Service → Book Service (decrement available copies)
5. Loan Service → MongoDB Atlas (create loan record)
6. Loan Service → Client (return loan details)
```

## Testing Strategy

### Unit Testing
- Service-specific business logic testing
- Data model validation with Mongoose
- Error handling and edge cases

### Integration Testing
- Inter-service communication via Nginx
- MongoDB Atlas integration testing
- API endpoint testing with Dockerized services

### End-to-End Testing
- Complete user workflows (e.g., loan creation and return)
- Error scenarios (e.g., 502 Bad Gateway recovery)
- Load testing with multiple concurrent requests

## Troubleshooting

### Port Conflicts
Ensure ports 80, 8080, 8081, 8082, and 27017 are not in use by other applications.
```bash
sudo lsof -i :<port>
```

### Dependency Issues
Verify that each service's `package.json` includes all required dependencies (e.g., express, mongoose, axios).

### Nginx Errors
Check Nginx logs if requests fail:
```bash
docker-compose logs nginx
```

### Database Connection Issues
- **502 Bad Gateway**: Check `docker-compose logs nginx` and `docker-compose logs <service>` for upstream errors
- **Connection Issues**: Verify MongoDB Atlas IP whitelisting and `.env` variables
- **Authentication Errors**: Ensure MongoDB Atlas credentials are correct in `.env` file

### Common Issues and Solutions

1. **Container fails to start**: Check the logs using `docker-compose logs <service-name>`
2. **Database connection issues**: Ensure MongoDB container is running and accessible
3. **Service communication problems**: Verify network configuration and service names
4. **Build failures**: Check Dockerfile syntax and ensure all dependencies are properly specified

## Important Notes

- Environment variables for MongoDB connections and service URLs are set in `docker-compose.yml`
- Ensure each service's `npm start` script is configured to run the application (e.g., `node src/index.js`)
- The Nginx configuration proxies requests to the appropriate service based on the URL path
- All containers are configured to restart automatically unless manually stopped
- Data persistence is handled through Docker volumes for MongoDB

## Future Enhancements

1. **CI/CD Pipeline**: Automate builds and deployments with GitHub Actions
2. **Service Mesh**: Integrate Istio for traffic management
3. **API Versioning**: Support `/v1/` and `/v2/` endpoints
4. **Real-time Updates**: Implement WebSocket notifications
5. **Advanced Analytics**: Integrate with Elasticsearch for reporting
6. **High Availability**: Add Docker Swarm or Kubernetes for scaling
7. **Monitoring**: Add Prometheus and Grafana for metrics collection
8. **Security**: Implement JWT authentication and HTTPS

## Next Steps

After successfully setting up the Docker environment:

1. Test each service endpoint to ensure they're responding correctly
2. Verify inter-service communication is working as expected
3. Check MongoDB data persistence by restarting containers
4. Monitor logs for any runtime issues
5. Consider setting up automated testing within the containerized environment
6. Implement monitoring and logging solutions
7. Set up production deployment strategies

## Support

If you encounter issues during setup:

1. Check the troubleshooting section above
2. Review container logs for error messages
3. Verify all prerequisites are installed correctly
4. Ensure project structure matches the required layout
5. Validate MongoDB Atlas configuration and network accessibility

## License
[MIT License] - See `LICENSE` file for details.
