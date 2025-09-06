const { Sequelize, DataTypes } = require('sequelize');
const DatabaseInterface = require('./DatabaseInterface');
require('dotenv').config();

class MySQLTodoModel extends DatabaseInterface {
  constructor() {
    super();
    this.sequelize = null;
    this.Todo = null;
  }

  async initialize() {
    try {
      // Create Sequelize connection
      this.sequelize = new Sequelize(
        process.env.MYSQL_DATABASE || 'todoapp',
        process.env.MYSQL_USERNAME || 'root',
        process.env.MYSQL_PASSWORD || '',
        {
          host: process.env.MYSQL_HOST || 'localhost',
          port: process.env.MYSQL_PORT || 3306,
          dialect: 'mysql',
          logging: process.env.NODE_ENV === 'development' ? console.log : false,
          pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
          },
          dialectOptions: {
            ssl: process.env.MYSQL_SSL === 'true' ? {
              require: true,
              rejectUnauthorized: false
            } : false
          }
        }
      );

      // Define Todo model
      this.Todo = this.sequelize.define('Todo', {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },
        title: {
          type: DataTypes.STRING(200),
          allowNull: false,
          validate: {
            notEmpty: true,
            len: [1, 200]
          }
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
          defaultValue: ''
        },
        completed: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW
        }
      }, {
        tableName: 'todos',
        timestamps: true,
        underscored: false
      });

      // Test connection and sync database
      await this.sequelize.authenticate();
      console.log('MySQL connection established successfully.');
      
      // Sync database (create tables if they don't exist)
      await this.sequelize.sync({ alter: false });
      console.log('MySQL database synchronized successfully.');
      
    } catch (error) {
      console.error('Unable to connect to MySQL database:', error);
      throw error;
    }
  }

  async close() {
    if (this.sequelize) {
      await this.sequelize.close();
      console.log('MySQL connection closed.');
    }
  }

  // Create a new todo
  async create(todoData) {
    try {
      const todo = await this.Todo.create({
        id: todoData.id || require('uuid').v4(),
        title: todoData.title,
        description: todoData.description || '',
        completed: false
      });
      
      return todo.toJSON();
    } catch (error) {
      throw new Error(`Failed to create todo: ${error.message}`);
    }
  }

  // Get all todos
  async getAll() {
    try {
      const todos = await this.Todo.findAll({
        order: [['createdAt', 'DESC']]
      });
      
      return todos.map(todo => todo.toJSON());
    } catch (error) {
      throw new Error(`Failed to get todos: ${error.message}`);
    }
  }

  // Get a specific todo by ID
  async getById(id) {
    try {
      const todo = await this.Todo.findByPk(id);
      return todo ? todo.toJSON() : null;
    } catch (error) {
      throw new Error(`Failed to get todo: ${error.message}`);
    }
  }

  // Update a todo
  async update(id, updateData) {
    try {
      const allowedFields = ['title', 'description', 'completed'];
      const updateFields = {};
      
      // Filter allowed fields
      Object.keys(updateData).forEach(key => {
        if (allowedFields.includes(key)) {
          updateFields[key] = updateData[key];
        }
      });

      if (Object.keys(updateFields).length === 0) {
        throw new Error('No valid fields to update');
      }

      // Always update the updatedAt timestamp
      updateFields.updatedAt = new Date();

      const [affectedRows] = await this.Todo.update(updateFields, {
        where: { id },
        returning: true
      });

      if (affectedRows === 0) {
        throw new Error('Todo not found');
      }

      // Return the updated todo
      const updatedTodo = await this.Todo.findByPk(id);
      return updatedTodo.toJSON();
    } catch (error) {
      throw new Error(`Failed to update todo: ${error.message}`);
    }
  }

  // Delete a todo
  async delete(id) {
    try {
      const deletedRows = await this.Todo.destroy({
        where: { id }
      });

      if (deletedRows === 0) {
        throw new Error('Todo not found');
      }

      return { message: 'Todo deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete todo: ${error.message}`);
    }
  }
}

module.exports = MySQLTodoModel;
