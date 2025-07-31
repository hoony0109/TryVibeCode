# Game Operation Tool

This repository contains the source code for the Game Operation Tool, designed to efficiently manage and monitor game services. This tool is built with a clear separation of concerns, utilizing a modern web technology stack for both frontend and backend components.

## Architecture Overview

The Game Operation Tool follows a **Monorepo** structure, where both the frontend and backend applications reside within a single Git repository. This approach offers several benefits:

- **Simplified Code Sharing**: Easier to share code, configurations, and types between frontend and backend.
- **Atomic Commits**: Changes across both parts of the application can be committed together, ensuring consistency.
- **Centralized Dependency Management**: Manage all project dependencies from a single root.
- **Streamlined Development Workflow**: Developers can work on both frontend and backend simultaneously within the same environment.

### Architectural Patterns Explained

#### 1. Monorepo

A Monorepo (monolithic repository) is a single repository that contains multiple distinct projects, in our case, the `frontend` and `backend`. Instead of having separate repositories for each, they are housed together. This helps in managing related projects, ensuring consistent tooling, and simplifying cross-project changes.

#### 2. Client-Server Architecture

This tool employs a classic client-server architecture. The **Frontend** acts as the client, which is what users interact with in their web browser. It sends requests to the **Backend** (the server), which processes these requests, interacts with databases, and sends back responses. This separation allows for independent development and scaling of both parts.

#### 3. Layered Architecture (Backend)

The backend follows a layered architecture, which helps in organizing code, managing complexity, and promoting reusability. While not strictly enforced with separate folders for each layer yet, the design principles are applied:

- **Presentation Layer (Routes)**: Handles incoming HTTP requests and sends responses. This is where API endpoints are defined (e.g., `backend/routes/auth.js`).
- **Business Logic Layer (Services/Controllers)**: Contains the core logic of the application, processing data, and making decisions. (Implicitly handled within routes for now, but can be extracted into separate service files as complexity grows).
- **Data Access Layer (Models/Config)**: Manages interactions with databases, abstracting away the complexities of database operations (e.g., `backend/config/mysql.js`, `backend/models/Log.js`).

### Technology Stack

- **Frontend**: React (with Vite for fast development) - A JavaScript library for building user interfaces.
- **Backend**: Node.js with Express.js - A JavaScript runtime environment and a fast, unopinionated, minimalist web framework for building APIs.
- **Databases**:
    - **MySQL**: A relational database management system (RDBMS) used for structured data. Here, it stores critical operational data like admin accounts, user profiles, and game-related configurations (e.g., coupons).
    - **Redis**: An in-memory data structure store, used as a database, cache, and message broker. In this project, it's primarily used for session management (e.g., blacklisting JWT tokens for logout) and caching frequently accessed data to improve performance.
    - **MongoDB**: A NoSQL document database, ideal for unstructured or semi-structured data. It's used for storing logs and analytics data, which can be high-volume and flexible in schema.
- **Communication**: TCP sockets for real-time communication with game servers. This allows for direct, persistent connections for immediate data exchange, crucial for game operations.

### Authentication and Authorization Flow (Phase 2 Implementation)

Phase 2 focused on establishing a secure and robust authentication and authorization system:

1.  **User Login**: When an administrator attempts to log in via the frontend, the request is sent to the backend's `/api/auth/login` endpoint.
2.  **Input Validation**: The backend first validates the incoming `username` and `password` using `express-validator` to prevent common security vulnerabilities like injection attacks.
3.  **Password Hashing**: The provided password is compared against a securely hashed password stored in MySQL using `bcryptjs`. This ensures that raw passwords are never stored, enhancing security.
4.  **JWT Generation**: Upon successful authentication, a JSON Web Token (JWT) is generated. This token contains essential information about the authenticated administrator (e.g., `admin.id`, `admin.role`). The JWT is signed with a `SECRET_KEY` (stored securely in `.env`) to ensure its integrity.
5.  **Token Transmission**: The generated JWT is sent back to the frontend. The frontend will then store this token (e.g., in local storage) and include it in the `x-auth-token` header of subsequent requests to authenticated routes.
6.  **Authentication Middleware (`auth.js`)**: For protected routes, an `auth` middleware is used. This middleware intercepts incoming requests, extracts the JWT from the `x-auth-token` header, and verifies its authenticity and expiration using the `SECRET_KEY`. If valid, the administrator's information from the token is attached to the request object (`req.admin`).
7.  **Role-Based Access Control Middleware (`roleAuth.js`)**: Building upon the `auth` middleware, the `roleAuth` middleware provides fine-grained access control. It checks the `admin.role` from the authenticated JWT against a list of allowed roles for a specific route. If the administrator's role is not authorized, access is denied.
8.  **Logout Functionality**: When an administrator logs out, the JWT is sent to the backend's `/api/auth/logout` endpoint. Instead of simply deleting the token from the client, the token is added to a blacklist in Redis. This ensures that even if the token is intercepted, it cannot be reused for authentication until its natural expiration, enhancing security.
9.  **Activity Logging**: Significant administrative actions, such as login and logout, are logged to MongoDB. This provides an audit trail, allowing for monitoring and troubleshooting of administrative activities.

## Getting Started

To set up the project locally, follow these steps:

### Prerequisites

- Node.js (LTS version recommended)
- npm or Yarn
- Docker (recommended for local database setup) or direct installations of MySQL, Redis, and MongoDB.

### 1. Clone the Repository

```bash
git clone <repository-url>
cd GameOperationTool
```

### 2. Backend Setup

Navigate to the `backend` directory and install dependencies:

```bash
cd backend
npm install # or yarn install
```

Configure environment variables by creating a `.env` file in the `backend` directory. Refer to `.env.example` for required variables.

### 3. Frontend Setup

Navigate to the `frontend` directory and install dependencies:

```bash
cd ../frontend
npm install # or yarn install
```

### 4. Database Setup

Instructions for setting up MySQL, Redis, and MongoDB will be provided in separate documentation or scripts. For local development, Docker Compose will be recommended.

## Development

### Running the Backend

```bash
cd backend
npm start # or yarn start
```

### Running the Frontend

```bash
cd frontend
npm start # or yarn start
```

## Contributing

Refer to `CodeWritingGuidelines.md` for coding standards and best practices.