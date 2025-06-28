# Smart Library System - Phase 4: Docker Setup Instructions

## Prerequisites

Before getting started, ensure you have the following installed on your system:

- Docker installed on your system
- Docker Compose installed on your system

## Project Structure

Ensure your project directory is structured as follows:

```
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
```

## Setup Instructions

### 1. Clone or Update the Repository

- Ensure all service code (User, Loan, Book) is in their respective directories (`user-service`, `loan-service`, `book-service`)
- Copy the provided Dockerfiles, `docker-compose.yml`, and `nginx.conf` into the appropriate directories

### 2. Build and Run Containers

Navigate to the project root directory and run:

```bash
docker-compose up --build
```

This command builds the Docker images for each service and starts the containers, including MongoDB and Nginx.

## Access the Services

Once the containers are running, you can access the services at the following URLs:

- **User Service**: http://localhost/api/users/
- **Loan Service**: http://localhost/api/loans/
- **Book Service**: http://localhost/api/books/
- **MongoDB**: Accessible internally via `mongodb://mongo:27017`

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

## Network Configuration

All services are connected via a custom bridge network (`library-network`). Services can communicate using their service names (`user-service`, `loan-service`, `book-service`, `mongo`) as hostnames.

## Volume Configuration

MongoDB data is persisted in a Docker volume (`mongo-data`) to ensure data is retained between container restarts.

## Troubleshooting

### Port Conflicts
Ensure ports 80, 8080, 8081, 8082, and 27017 are not in use by other applications.

### Dependency Issues
Verify that each service's `package.json` includes all required dependencies (e.g., express, mongoose, axios).

### Nginx Errors
Check Nginx logs if requests fail:
```bash
docker-compose logs nginx
```

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

## Next Steps

After successfully setting up the Docker environment:

1. Test each service endpoint to ensure they're responding correctly
2. Verify inter-service communication is working as expected
3. Check MongoDB data persistence by restarting containers
4. Monitor logs for any runtime issues
5. Consider setting up automated testing within the containerized environment

## Support

If you encounter issues during setup:

1. Check the troubleshooting section above
2. Review container logs for error messages
3. Verify all prerequisites are installed correctly
4. Ensure project structure matches the required layout
