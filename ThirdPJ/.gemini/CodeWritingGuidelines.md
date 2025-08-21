# Code Writing Guidelines

## 1. General Principles
- **Code Reusability**: Before writing new code, review existing codebase to identify opportunities for modification or reuse.
- **File Size Limit**: Keep individual files under 300 lines to maintain readability and manageability. Split larger files into modular components.
- **Environment Consideration**: Write code compatible with development (dev), testing (test), and production (prod) environments. Use environment-specific configurations (e.g., `.env.dev`, `.env.test`, `.env.prod`).
- **Documentation**: Include clear comments for complex logic and maintain updated README or inline documentation for setup and usage.

## 2. Development Practices
- **Testing After Changes**: Always restart the server after code changes to test functionality. Automate this process where possible (e.g., using nodemon for Node.js or live-reload tools).
- **One-Time Scripts**: For scripts intended for single use (e.g., data migration or temporary fixes):
  - Execute directly in the terminal or runtime environment.
  - Avoid saving to files unless required for audit purposes.
  - Delete temporary scripts after execution to prevent clutter.
- **Modular Design**: Break down code into reusable functions and modules to enhance maintainability and reduce duplication.

## 3. Environment-Specific Guidelines
- **Configuration Management**:
  - Use environment variables for sensitive data (e.g., database credentials, API keys) via `.env` files specific to each environment.
  - Ensure `.env` files are excluded from version control (e.g., add to `.gitignore`).
- **Dev Environment**:
  - Enable verbose logging and debugging tools.
  - Use mock data or sandbox APIs to avoid impacting live systems.
- **Test Environment**:
  - Mirror production setup as closely as possible but use isolated databases and services.
  - Automate unit and integration tests for all new code.
- **Prod Environment**:
  - Minimize logging to essential information to reduce overhead.
  - Implement monitoring and error tracking (e.g., Sentry, New Relic).
  - Ensure zero-downtime deployments (e.g., using blue-green deployment or rolling updates).

## 4. Code Quality and Review
- **Linting and Formatting**: Use tools like ESLint (for JavaScript) and Prettier to enforce consistent code style across the project.
- **Code Reviews**: Submit all changes for peer review to catch potential issues and ensure adherence to guidelines.
- **Unit Testing**: Write unit tests for critical functions and APIs, targeting at least 80% code coverage.
- **Version Control**:
  - Commit changes frequently with clear, descriptive messages.
  - Use feature branches for new development and hotfix branches for urgent production fixes.

## 5. Performance and Scalability
- **Optimization**: Profile code to identify bottlenecks, especially for database queries and API endpoints.
- **Caching**: Implement caching (e.g., Redis) for frequently accessed data, with appropriate invalidation strategies.
- **Scalability**: Design code to handle increased load (e.g., use connection pooling for databases, implement load balancing).

## 6. Security Practices
- **Input Validation**: Sanitize and validate all user inputs to prevent injection attacks (e.g., SQL injection, XSS).
- **Authentication/Authorization**: Use secure authentication (e.g., JWT, OAuth) and role-based access control.
- **Dependency Management**: Regularly update dependencies to patch vulnerabilities, using tools like Dependabot or npm audit.

## 7. Error Handling and Logging
- **Robust Error Handling**: Implement try-catch blocks or equivalent for error-prone operations, providing meaningful error messages.
- **Centralized Logging**: Use a logging framework (e.g., Winston for Node.js) to centralize logs, with different log levels for each environment.
- **Error Monitoring**: Integrate with error tracking tools in production to capture and alert on unhandled exceptions.

## 8. Deployment and Maintenance
- **Automated Deployments**: Use CI/CD pipelines (e.g., GitHub Actions, Jenkins) for consistent deployments across environments.
- **Rollback Plan**: Ensure every deployment includes a rollback strategy in case of failures.
- **Post-Deployment Testing**: Run smoke tests after deployment to verify core functionality.