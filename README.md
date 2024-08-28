# **Authentication with NestJS, Neon, and JWT**

This project demonstrates how to implement a secure authentication system using **NestJS**, **Neon (serverless PostgreSQL)**, and **JWT (JSON Web Tokens)**. The goal is to provide a robust and scalable solution for user authentication, including user registration, login, and protected routes using JWT for stateless authentication.

## **Table of Contents**

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Validation](#validation)
- [Error Handling](#error-handling)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## **Features**

- User Registration and Login with password hashing using bcrypt.
- Secure JWT authentication with token generation and validation.
- Role-based route protection using NestJS guards.
- Direct interaction with Neon database using SQL queries.
- Input validation using `class-validator` and `class-transformer`.
- Detailed error handling and JSON responses for all error cases.

## **Technologies Used**

- **NestJS**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **Neon**: A serverless PostgreSQL database offering high scalability and easy branching for development.
- **JWT**: Used for secure, stateless authentication.
- **Class-Validator & Class-Transformer**: For validating and transforming incoming requests.
- **Bcrypt**: For secure password hashing.

## **Getting Started**

### **Prerequisites**

Ensure you have the following installed on your local development environment:

- Node.js (v14 or later)
- npm (v6 or later)
- Neon account for database access

### **Installation**

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/nestjs-neon-authentication.git
   cd nestjs-neon-authentication
   ```

2. **Install Dependencies**

Install the necessary dependencies:

```
npm install
```

3. **Environment Variables**

Create a `.env` file in the root directory and configure the following environment variables:

- **DATABASE_URL**: Your Neon database connection string.
- **JWT_SECRET**: A secret key for signing JWTs. Ensure this is kept secure.

## **Database Setup**

### 1. Create the User Table

Run the following command to create the `users` table in your Neon database:

```
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

```

### 2. Verify Table Creation

Ensure the table exists and is accessible in your Neon database.

## Running the Application

### 1. Start the Application

Start the application using:

```
npm run start
```

### 2. Access the Application

The application will be running at `http://localhost:3000`.

## API Endpoints

### User Registration

- **URL**: `/auth/register`
- **Method**: `POST`
- **Body**:

```
json { "username": "your_username", "password": "your_password" }
```

- **Description**: Registers a new user with a username and password.

### User Login

- **URL**: `/auth/login`
- **Method**: `POST`
- **Body**:

```
json { "username": "your_username", "password": "your_password" }
```

- **Description**: Authenticates a user and returns a JWT access token.

### Protected Route

- **URL**: `/auth/profile`
- **Method**: `GET`
- **Headers**:
  - `Authorization: Bearer <token>`
- **Description**: Access protected content. Requires a valid JWT.

## Validation

- **DTOs**: Data Transfer Objects are used to define the structure and validation rules for incoming requests.
- **Validation Pipe**: Ensures incoming data adheres to defined rules using `class-validator` decorators such as `@IsString()`, `@IsNotEmpty()`, and others.

## Error Handling

- **Structured Error Responses**: Uses NestJS’s `HttpException` to standardize error responses, including proper HTTP status codes and error messages.
- **Logging**: Logs unexpected errors for easier debugging and monitoring.

## Project Structure

src/
│
├── auth/
│ ├── dto/
│ │ ├── create-user.dto.ts
│ │ └── login.dto.ts
│ ├── auth.module.ts
│ ├── auth.service.ts
│ ├── auth.controller.ts
│ ├── jwt.strategy.ts
│
├── database/
│ ├── database.controller.ts
│ ├── database.service.ts
│ ├── database.module.ts
│
├── app.module.ts
├── main.ts
└── ...

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or new features.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
