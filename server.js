const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const TodoModel = require('./models/TodoModel');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Todo model
const todoModel = new TodoModel();

// Validation middleware
const validateTodo = (req, res, next) => {
  const { title } = req.body;
  
  if (!title || title.trim().length === 0) {
    return res.status(400).json({ 
      error: 'Title is required and cannot be empty' 
    });
  }
  
  if (title.length > 200) {
    return res.status(400).json({ 
      error: 'Title must be less than 200 characters' 
    });
  }
  
  next();
};

// API Routes

// GET /api/todos - Get all todos
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await todoModel.getAll();
    res.json(todos);
  } catch (error) {
    console.error('Error getting todos:', error);
    res.status(500).json({ error: 'Failed to retrieve todos' });
  }
});

// POST /api/todos - Create a new todo
app.post('/api/todos', validateTodo, async (req, res) => {
  try {
    const todo = await todoModel.create(req.body);
    res.status(201).json(todo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// GET /api/todos/:id - Get a specific todo
app.get('/api/todos/:id', async (req, res) => {
  try {
    const todo = await todoModel.getById(req.params.id);
    
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json(todo);
  } catch (error) {
    console.error('Error getting todo:', error);
    res.status(500).json({ error: 'Failed to retrieve todo' });
  }
});

// PUT /api/todos/:id - Update a todo
app.put('/api/todos/:id', async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    const updateData = {};
    
    if (title !== undefined) {
      if (!title || title.trim().length === 0) {
        return res.status(400).json({ 
          error: 'Title cannot be empty' 
        });
      }
      updateData.title = title;
    }
    
    if (description !== undefined) {
      updateData.description = description;
    }
    
    if (completed !== undefined) {
      updateData.completed = Boolean(completed);
    }
    
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ 
        error: 'No valid fields to update' 
      });
    }
    
    const updatedTodo = await todoModel.update(req.params.id, updateData);
    res.json(updatedTodo);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// DELETE /api/todos/:id - Delete a todo
app.delete('/api/todos/:id', async (req, res) => {
  try {
    await todoModel.delete(req.params.id);
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Todo App server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to use the application`);
});
