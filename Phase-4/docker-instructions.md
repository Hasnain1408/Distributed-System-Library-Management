Smart Library System - Phase 4: Docker Setup Instructions
Prerequisites

Docker installed on your system
Docker Compose installed on your system

Project Structure
Ensure your project directory is structured as follows:
smart-library-system/
├── user-service/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   ├── package.json
│   ├── Dockerfile.user
├── loan-service/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   ├── package.json
│   ├── Dockerfile.loan
├── book-service/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   ├── package.json
│   ├── Dockerfile.book
├── config/
│   ├── nginx.conf
├── docker-compose.yml

Setup Instructions

Clone or Update the Repository.Ensure all service code (User, Loan, Book) is in their respective directories (user-service, loan-service, book-service). Copy the provided Dockerfiles, docker-compose.yml, and nginx.conf into the appropriate directories.

Build and Run Containers.Navigate to the project root directory and run:
docker-compose up --build

This command builds the Docker images for each service and starts the containers, including MongoDB and Nginx.

Access the Services

User Service: http://localhost/api/users/
Loan Service: http://localhost/api/loans/
Book Service: http://localhost/api/books/
MongoDB: Accessible internally via mongodb://mongo:27017


Docker CLI Commands

View running containers:
docker ps


Check container logs (replace <service> with user-service, loan-service, book-service, mongo, or nginx):
docker-compose logs <service>


Access a container's shell:
docker exec -it <container_name> sh


Stop all containers:
docker-compose down




Network Configuration : All services are connected via a custom bridge network (library-network). Services can communicate using their service names (user-service, loan-service, book-service, mongo) as hostnames.

Volume Configuration : MongoDB data is persisted in a Docker volume (mongo-data) to ensure data is retained between container restarts.


Troubleshooting

Port Conflicts: Ensure ports 80, 8080, 8081, 8082, and 27017 are not in use by other applications.

Dependency Issues: Verify that each service’s package.json includes all required dependencies (e.g., express, mongoose, axios).

Nginx Errors: Check Nginx logs if requests fail:
docker-compose logs nginx



Notes

Environment variables for MongoDB connections and service URLs are set in docker-compose.yml.
Ensure each service’s npm start script is configured to run the application (e.g., node src/index.js).
The Nginx configuration proxies requests to the appropriate service based on the URL path.
