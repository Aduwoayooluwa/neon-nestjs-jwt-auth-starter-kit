# **Basic Secure Chat Application with NestJS, WebSocket, and Neon Postgres**

This is a real-time chat application built using **NestJS** as the backend framework, **WebSocket** for real-time communication, and **Neon** (PostgreSQL) as the database. The application provides a simple, scalable, and efficient chat platform where users can connect, send messages, and see other users' messages in real time. It also includes **JWT-based authentication** to ensure secure user access and communication.

### **Features**

- **Real-time Messaging:** Leveraging WebSocket for instant messaging without page reloads.
- **User Authentication:** JWT-based authentication for secure user access, registration, and login functionality.
- **Persistent Storage:** Messages and user data are stored in a Neon (Postgres) database.
- **Secure Connections:** Utilizes JWT for secure client-server communication.
- **Expandable Architecture:** Modular structure, easy to extend with more features.

## **Technologies Used**

- **NestJS**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **Neon**: A serverless PostgreSQL database offering high scalability and easy branching for development.
- **JWT**: Used for secure, stateless authentication.
- **Class-Validator & Class-Transformer**: For validating and transforming incoming requests.
- **Bcrypt**: For secure password hashing.
- **WebSocket (Socket-io)**: Enables real-time, bidirectional, and event-based communication.

## **Getting Started**

### **Prerequisites**

Before you begin, ensure you have met the following requirements:

- **Node.js** installed on your machine.
- **NestJS CLI** installed globally (`npm install -g @nestjs/cli`).
- **PostgreSQL database connection URL** from [Neon](https://neon.tech/).

### **Installation**

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/Aduwoayooluwa/neon-nestjs-jwt-auth-starter-kit.git
   cd neon-nestjs-jwt-auth-starter-kit
   git fetch origin chat-server
   git checkout chat-server
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
  user_id VARCHAR(25) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  sender_id VARCHAR(25) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

```

### 2. Verify Table Creation

Ensure the table exists and is accessible in your Neon database.

## Running the Application

### 1. Start the Application

Start the application using:

```
npm run start:dev
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

### **Connect to WebSocket Server:**

- Use a WebSocket client (like Socket.io client or a browser-based client) to connect to the WebSocket server at `ws://localhost:3002`.
- Ensure you provide the JWT token in the connection request for authentication.

### **Send and Receive Messages:**

- Once connected, you can emit a `newMessage` event with the message content.
- The server will broadcast the message to all connected clients and store it in the Neon Postgres database.

### **Authentication**

- **Register:** Users can register using their `username` and `password`, which are stored securely in the database with hashed passwords.
- **Login:** Users must log in to obtain a JWT token, which is used to authenticate WebSocket connections and other API requests.
- **Secure Communication:** The JWT token must be included in the headers or as part of the WebSocket connection request to verify the user's identity.

## Project Structure

```plaintextsrc/
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
├── chat/
│ ├── chat.gateway.ts
│ ├── chat.module.ts

├── app.module.ts
├── main.ts
└──
```

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or new features.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### **Acknowledgements**

- **Neon** for providing an excellent Postgres solution.

### **Contact**

For more information, please contact me on [X @ Coding Pastor](https://x.com/codingpastor) or [LinkedIn](https://linkedin.com/in/aduwo-ayooluwa).
