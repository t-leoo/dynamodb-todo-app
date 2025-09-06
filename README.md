# Todo App with DynamoDB

A simple Todo application built with Node.js, Express.js, and AWS DynamoDB.

## Features

- Create, read, update, and delete todos
- Persistent storage using AWS DynamoDB
- RESTful API endpoints
- Simple web interface

## Prerequisites

- Node.js (v14 or higher) OR Docker
- AWS Account with DynamoDB access
- AWS CLI configured with appropriate credentials

## Setup Instructions

### Option 1: Using Docker (Recommended)

1. **Configure AWS credentials:**
   Create a `.env` file in the root directory:
   ```
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   DYNAMODB_TABLE_NAME=todos
   ```

2. **Build and run with Docker Compose:**
   ```bash
   # Start the application
   npm run docker:up
   
   # View logs
   npm run docker:logs
   
   # Stop the application
   npm run docker:down
   ```

3. **Or use individual Docker commands:**
   ```bash
   # Build the Docker image
   npm run docker:build
   
   # Run the container
   npm run docker:run
   ```

### Option 2: Using Node.js directly

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure AWS credentials:**
   Create a `.env` file in the root directory:
   ```
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   DYNAMODB_TABLE_NAME=todos
   ```

3. **Create DynamoDB table:**
   The application will automatically create the table if it doesn't exist.

4. **Run the application:**
   ```bash
   npm start
   ```
   
   For development with auto-restart:
   ```bash
   npm run dev
   ```

### Access the Application

- **API:** http://localhost:3000/api/todos
- **Web Interface:** http://localhost:3000

## API Endpoints

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

## Docker Commands

| Command | Description |
|---------|-------------|
| `npm run docker:build` | Build the Docker image |
| `npm run docker:run` | Run the container with .env file |
| `npm run docker:up` | Start with Docker Compose (detached) |
| `npm run docker:down` | Stop Docker Compose services |
| `npm run docker:logs` | View application logs |
| `npm run docker:restart` | Restart the application |

## Environment Variables

- `AWS_REGION` - AWS region for DynamoDB
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `DYNAMODB_TABLE_NAME` - DynamoDB table name (default: todos)
- `PORT` - Server port (default: 3000)
