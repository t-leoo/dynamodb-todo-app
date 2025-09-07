# Todo App with Multiple Database Support

A flexible Todo application built with Node.js, Express.js, and support for both AWS DynamoDB and MySQL/RDS databases.

## Features

- Create, read, update, and delete todos
- **Dual Database Support**: Switch between DynamoDB and MySQL/RDS
- RESTful API endpoints
- Simple web interface
- Docker support with both database options
- Database abstraction layer for easy switching

## Prerequisites

- Node.js (v14 or higher) OR Docker
- **For DynamoDB**: AWS Account with DynamoDB access and AWS CLI configured
- **For MySQL/RDS**: MySQL server or AWS RDS MySQL instance

## Setup Instructions

### Option 1: Using Docker (Recommended)

#### With DynamoDB:
1. **Configure environment:**
   Create a `.env` file:
   ```
   DATABASE_TYPE=dynamodb
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   DYNAMODB_TABLE_NAME=todos
   ```

2. **Start with Docker Compose:**
   ```bash
   npm run docker:up
   ```

#### With MySQL:
1. **Configure environment:**
   Create a `.env` file:
   ```
   DATABASE_TYPE=mysql
   MYSQL_HOST=mysql
   MYSQL_PORT=3306
   MYSQL_USERNAME=root
   MYSQL_PASSWORD=rootpassword
   MYSQL_DATABASE=todoapp
   ```

2. **Start with Docker Compose (includes MySQL container):**
   ```bash
   npm run docker:up
   ```

#### Docker Commands:
```bash
# Start the application
npm run docker:up

# View logs
npm run docker:logs

# Stop the application
npm run docker:down
```

### Option 2: Using Node.js directly

#### With DynamoDB:
1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   Create a `.env` file:
   ```
   DATABASE_TYPE=dynamodb
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   DYNAMODB_TABLE_NAME=todos
   ```

3. **Setup DynamoDB table:**
   ```bash
   npm run setup
   ```

4. **Start the application:**
   ```bash
   npm start
   ```

#### With MySQL:
1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   Create a `.env` file:
   ```
   DATABASE_TYPE=mysql
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_USERNAME=root
   MYSQL_PASSWORD=your_password
   MYSQL_DATABASE=todoapp
   ```

3. **Setup MySQL database:**
   ```bash
   npm run setup:mysql
   ```

4. **Start the application:**
   ```bash
   npm start
   ```

### Access the Application

- **API:** http://localhost:3000/api/todos
- **Web Interface:** http://localhost:3000

## Switching Between Databases

The application supports switching between DynamoDB and MySQL/RDS by changing the `DATABASE_TYPE` environment variable:

### DynamoDB Configuration:
```bash
DATABASE_TYPE=dynamodb
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
DYNAMODB_TABLE_NAME=todos
```

### MySQL/RDS Configuration:
```bash
DATABASE_TYPE=mysql
MYSQL_HOST=your-mysql-host
MYSQL_PORT=3306
MYSQL_USERNAME=your_username
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=todoapp
MYSQL_SSL=true  # Set to true for RDS
```

**Note:** When switching databases, you'll need to recreate your todos as they are stored in different systems.

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

### Database Configuration
- `DATABASE_TYPE` - Database type: `dynamodb`, `mysql`, or `rds` (default: dynamodb)

### DynamoDB Variables (when DATABASE_TYPE=dynamodb)
- `AWS_REGION` - AWS region for DynamoDB
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `DYNAMODB_TABLE_NAME` - DynamoDB table name (default: todos)
- `AWS_DYNAMODB_ENDPOINT` - Custom DynamoDB endpoint (optional)

### MySQL/RDS Variables (when DATABASE_TYPE=mysql or rds)
- `MYSQL_HOST` - MySQL host (default: localhost)
- `MYSQL_PORT` - MySQL port (default: 3306)
- `MYSQL_USERNAME` - MySQL username (default: root)
- `MYSQL_PASSWORD` - MySQL password
- `MYSQL_DATABASE` - MySQL database name (default: todoapp)
- `MYSQL_SSL` - Enable SSL connection (default: false)

### Application Variables
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode (development/production)

### Application Sample
- ![alt text](https://github.com/t-leoo/dynamodb-todo-app/blob/main/sample.png?raw=true)
