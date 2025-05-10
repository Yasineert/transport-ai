# DevOps Pipeline for Marrakech Transport System

This document outlines the DevOps setup for the Marrakech Transport System project, including CI/CD pipeline, containerization, and infrastructure management.

## Project Structure

The project follows a structured approach to code management:

- **Main Branch**: Production-ready code
- **Development Branch**: Integration branch for features
- **Feature Branches**: Individual features (format: `feature/feature-name`)
- **Bugfix Branches**: Bug fixes (format: `bugfix/issue-description`)

## Build Agents

The pipeline uses self-hosted build agents for improved performance and customization:

- **Default Agent Pool**: A set of self-hosted agents configured for both Azure DevOps and GitHub Actions
- **Agent Requirements**: 
  - Docker and Docker Compose for containerization
  - Node.js 18 or higher for building the application
  - Kubernetes CLI for deployment operations
  - 4+ CPU cores and 8+ GB RAM recommended for optimal performance

## Continuous Integration (CI)

The CI pipeline is implemented using GitHub Actions and includes the following steps:

1. **Code Linting**: Ensures code quality and adherence to style guidelines
2. **Automated Testing**: Runs unit and integration tests
3. **Build Process**: Compiles the application and ensures it builds successfully
4. **Docker Image Creation**: Creates a containerized version of the application

### Test Reports

Test reports are automatically generated and stored as artifacts in GitHub Actions. These reports include:

- Code coverage metrics
- Test results summary
- Performance benchmarks

## Continuous Deployment (CD)

The CD pipeline automates the deployment process to different environments:

1. **Development Environment**: Automatic deployment when changes are pushed to the development branch
2. **Production Environment**: Manual approval required before deployment to production from the main branch

### Deployment Process

The deployment process uses Kubernetes for container orchestration:

1. Build and push Docker images to the container registry
2. Apply Kubernetes manifests to the target environment
3. Perform rolling updates to ensure zero-downtime deployments
4. Run post-deployment health checks

## Containerization

The application is containerized using Docker with multi-stage builds:

1. **Base Image**: Node.js Alpine for a small footprint
2. **Dependencies Stage**: Installs all required dependencies
3. **Build Stage**: Compiles the Next.js application
4. **Production Stage**: Only includes necessary files for running the application

## Infrastructure as Code (IaC)

All infrastructure is defined as code using Kubernetes YAML files:

- **Frontend Deployment**: Manages the Next.js frontend application
- **Backend Deployment**: Manages the API service
- **Database StatefulSet**: Manages the PostgreSQL database
- **Monitoring Deployment**: Sets up Prometheus and Grafana

## Monitoring and Observability

The monitoring stack includes:

1. **Prometheus**: Collects metrics from all services
2. **Grafana**: Visualizes metrics in customizable dashboards
3. **Log Aggregation**: Centralized logging system
4. **Alerts**: Automated alerting based on predefined thresholds

### Key Metrics

- Application response times
- Error rates
- CPU and memory usage
- Database query performance
- User activity metrics

## Secrets Management

Sensitive information is managed securely:

- Kubernetes Secrets for database credentials
- Environment-specific configurations
- CI/CD pipeline secrets stored in GitHub Secrets

## Disaster Recovery

The disaster recovery plan includes:

1. Regular database backups
2. Multi-region deployment capability
3. Automated rollback procedures
4. Incident response protocols

## Getting Started with DevOps

To get started with the DevOps pipeline:

1. Ensure you have access to the GitHub repository
2. Install Docker and Kubernetes CLI tools
3. Set up the required secrets in GitHub repository settings
4. Follow the branching strategy when contributing code 