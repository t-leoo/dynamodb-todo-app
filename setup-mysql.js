const mysql = require('mysql2/promise');
require('dotenv').config();

async function createMySQLDatabase() {
  let connection;
  
  try {
    const databaseName = process.env.MYSQL_DATABASE || 'todoapp';
    
    console.log(`Creating MySQL database: ${databaseName}`);
    
    // First, connect without specifying database to create it
    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      port: process.env.MYSQL_PORT || 3306,
      user: process.env.MYSQL_USERNAME || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      ssl: process.env.MYSQL_SSL === 'true' ? {
        rejectUnauthorized: false
      } : false
    });

    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\``);
    console.log(`Database ${databaseName} created successfully`);
    
    // Close the initial connection
    await connection.end();
    
    // Now connect directly to the specific database
    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      port: process.env.MYSQL_PORT || 3306,
      user: process.env.MYSQL_USERNAME || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: databaseName,
      ssl: process.env.MYSQL_SSL === 'true' ? {
        rejectUnauthorized: false
      } : false
    });
    
    console.log(`Connected to database ${databaseName} successfully`);

    // Create todos table
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS todos (
        id VARCHAR(36) PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        completed BOOLEAN NOT NULL DEFAULT FALSE,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_created_at (createdAt),
        INDEX idx_completed (completed)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    
    await connection.query(createTableSQL);
    console.log('Todos table created successfully');
    
    // Show table structure
    const [rows] = await connection.query('DESCRIBE todos');
    console.log('\nTable structure:');
    console.table(rows);
    
  } catch (error) {
    console.error('Error creating MySQL database:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('MySQL connection closed');
    }
  }
}

// Run the script
if (require.main === module) {
  createMySQLDatabase()
    .then(() => {
      console.log('MySQL setup complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('MySQL setup failed:', error);
      process.exit(1);
    });
}

module.exports = { createMySQLDatabase };
