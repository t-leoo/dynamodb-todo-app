const AWS = require('aws-sdk');
const DatabaseInterface = require('./DatabaseInterface');
require('dotenv').config();

// Configure AWS
AWS.config.update({
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const dynamodb = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_DYNAMODB_ENDPOINT,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
const tableName = process.env.DYNAMODB_TABLE_NAME || 'todos';

class DynamoDBTodoModel extends DatabaseInterface {
  constructor() {
    super();
    this.tableName = tableName;
  }

  async initialize() {
    // DynamoDB doesn't require explicit initialization
    return Promise.resolve();
  }

  async close() {
    // DynamoDB doesn't require explicit connection closing
    return Promise.resolve();
  }

  // Create a new todo
  async create(todoData) {
    const todo = {
      id: todoData.id || require('uuid').v4(),
      title: todoData.title,
      description: todoData.description || '',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const params = {
      TableName: this.tableName,
      Item: todo
    };

    try {
      await dynamodb.put(params).promise();
      return todo;
    } catch (error) {
      throw new Error(`Failed to create todo: ${error.message}`);
    }
  }

  // Get all todos
  async getAll() {
    const params = {
      TableName: this.tableName
    };

    try {
      const result = await dynamodb.scan(params).promise();
      return result.Items || [];
    } catch (error) {
      throw new Error(`Failed to get todos: ${error.message}`);
    }
  }

  // Get a specific todo by ID
  async getById(id) {
    const params = {
      TableName: this.tableName,
      Key: { id }
    };

    try {
      const result = await dynamodb.get(params).promise();
      return result.Item;
    } catch (error) {
      throw new Error(`Failed to get todo: ${error.message}`);
    }
  }

  // Update a todo
  async update(id, updateData) {
    const allowedFields = ['title', 'description', 'completed'];
    const updateExpressions = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    // Build update expression dynamically
    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key)) {
        updateExpressions.push(`#${key} = :${key}`);
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = updateData[key];
      }
    });

    if (updateExpressions.length === 0) {
      throw new Error('No valid fields to update');
    }

    updateExpressions.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    const params = {
      TableName: this.tableName,
      Key: { id },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    };

    try {
      const result = await dynamodb.update(params).promise();
      return result.Attributes;
    } catch (error) {
      throw new Error(`Failed to update todo: ${error.message}`);
    }
  }

  // Delete a todo
  async delete(id) {
    const params = {
      TableName: this.tableName,
      Key: { id }
    };

    try {
      await dynamodb.delete(params).promise();
      return { message: 'Todo deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete todo: ${error.message}`);
    }
  }
}

module.exports = DynamoDBTodoModel;
