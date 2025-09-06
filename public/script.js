class TodoApp {
    constructor() {
        this.todos = [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadTodos();
    }

    bindEvents() {
        // Form submission
        document.getElementById('todoForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createTodo();
        });

        // Modal close
        document.querySelector('.close').addEventListener('click', () => {
            this.hideErrorModal();
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('errorModal');
            if (e.target === modal) {
                this.hideErrorModal();
            }
        });
    }

    async loadTodos() {
        try {
            this.showLoading(true);
            const response = await fetch('/api/todos');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.todos = await response.json();
            this.renderTodos();
        } catch (error) {
            console.error('Error loading todos:', error);
            this.showError('Failed to load todos. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }

    async createTodo() {
        const form = document.getElementById('todoForm');
        const formData = new FormData(form);
        
        const todoData = {
            title: formData.get('title').trim(),
            description: formData.get('description').trim()
        };

        if (!todoData.title) {
            this.showError('Title is required');
            return;
        }

        try {
            const response = await fetch('/api/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(todoData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create todo');
            }

            const newTodo = await response.json();
            this.todos.unshift(newTodo);
            this.renderTodos();
            form.reset();
        } catch (error) {
            console.error('Error creating todo:', error);
            this.showError(error.message || 'Failed to create todo');
        }
    }

    async updateTodo(id, updates) {
        try {
            const response = await fetch(`/api/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update todo');
            }

            const updatedTodo = await response.json();
            const index = this.todos.findIndex(todo => todo.id === id);
            if (index !== -1) {
                this.todos[index] = updatedTodo;
                this.renderTodos();
            }
        } catch (error) {
            console.error('Error updating todo:', error);
            this.showError(error.message || 'Failed to update todo');
        }
    }

    async deleteTodo(id) {
        if (!confirm('Are you sure you want to delete this todo?')) {
            return;
        }

        try {
            const response = await fetch(`/api/todos/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete todo');
            }

            this.todos = this.todos.filter(todo => todo.id !== id);
            this.renderTodos();
        } catch (error) {
            console.error('Error deleting todo:', error);
            this.showError(error.message || 'Failed to delete todo');
        }
    }

    renderTodos() {
        const container = document.getElementById('todoContainer');
        const emptyState = document.getElementById('emptyState');

        if (this.todos.length === 0) {
            container.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        container.style.display = 'block';
        emptyState.style.display = 'none';

        container.innerHTML = this.todos.map(todo => this.createTodoHTML(todo)).join('');
    }

    createTodoHTML(todo) {
        const statusClass = todo.completed ? 'completed' : '';
        const statusText = todo.completed ? 'Completed' : 'Pending';
        const statusBadgeClass = todo.completed ? 'completed' : 'pending';

        return `
            <div class="todo-item ${statusClass}" data-id="${todo.id}">
                <div class="todo-header">
                    <div>
                        <div class="todo-title">${this.escapeHtml(todo.title)}</div>
                        ${todo.description ? `<div class="todo-description">${this.escapeHtml(todo.description)}</div>` : ''}
                    </div>
                    <div class="todo-actions">
                        <button class="btn btn-${todo.completed ? 'secondary' : 'success'}" 
                                onclick="todoApp.toggleTodo('${todo.id}')">
                            ${todo.completed ? 'Mark Pending' : 'Mark Complete'}
                        </button>
                        <button class="btn btn-danger" 
                                onclick="todoApp.deleteTodo('${todo.id}')">
                            Delete
                        </button>
                    </div>
                </div>
                <div class="todo-meta">
                    <div class="todo-status">
                        <span class="status-badge ${statusBadgeClass}">${statusText}</span>
                    </div>
                    <div class="todo-dates">
                        <small>Created: ${this.formatDate(todo.createdAt)}</small>
                        ${todo.updatedAt !== todo.createdAt ? `<small> | Updated: ${this.formatDate(todo.updatedAt)}</small>` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            this.updateTodo(id, { completed: !todo.completed });
        }
    }

    showLoading(show) {
        const loading = document.getElementById('loading');
        const container = document.getElementById('todoContainer');
        
        if (show) {
            loading.style.display = 'block';
            container.style.display = 'none';
        } else {
            loading.style.display = 'none';
        }
    }

    showError(message) {
        const modal = document.getElementById('errorModal');
        const errorMessage = document.getElementById('errorMessage');
        
        errorMessage.textContent = message;
        modal.style.display = 'flex';
    }

    hideErrorModal() {
        const modal = document.getElementById('errorModal');
        modal.style.display = 'none';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }
}

// Initialize the app when the page loads
let todoApp;
document.addEventListener('DOMContentLoaded', () => {
    todoApp = new TodoApp();
});
