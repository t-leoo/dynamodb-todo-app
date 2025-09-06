/**
 * Database Interface - Defines the contract for all database implementations
 */
class DatabaseInterface {
  /**
   * Create a new todo
   * @param {Object} todoData - Todo data
   * @returns {Promise<Object>} Created todo
   */
  async create(todoData) {
    throw new Error('create method must be implemented');
  }

  /**
   * Get all todos
   * @returns {Promise<Array>} Array of todos
   */
  async getAll() {
    throw new Error('getAll method must be implemented');
  }

  /**
   * Get a specific todo by ID
   * @param {string} id - Todo ID
   * @returns {Promise<Object|null>} Todo or null if not found
   */
  async getById(id) {
    throw new Error('getById method must be implemented');
  }

  /**
   * Update a todo
   * @param {string} id - Todo ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated todo
   */
  async update(id, updateData) {
    throw new Error('update method must be implemented');
  }

  /**
   * Delete a todo
   * @param {string} id - Todo ID
   * @returns {Promise<Object>} Deletion result
   */
  async delete(id) {
    throw new Error('delete method must be implemented');
  }

  /**
   * Initialize database connection
   * @returns {Promise<void>}
   */
  async initialize() {
    throw new Error('initialize method must be implemented');
  }

  /**
   * Close database connection
   * @returns {Promise<void>}
   */
  async close() {
    throw new Error('close method must be implemented');
  }
}

module.exports = DatabaseInterface;
