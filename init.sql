-- MySQL initialization script for Todo App
-- This script runs when the MySQL container starts for the first time

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS todoapp;
USE todoapp;

-- Create todos table
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

-- Insert some sample data
INSERT INTO todos (id, title, description, completed) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Welcome to Todo App', 'This is your first todo item!', FALSE),
('550e8400-e29b-41d4-a716-446655440002', 'Setup MySQL Database', 'Configure MySQL connection and create tables', TRUE),
('550e8400-e29b-41d4-a716-446655440003', 'Test CRUD Operations', 'Test create, read, update, and delete functionality', FALSE)
ON DUPLICATE KEY UPDATE title=VALUES(title);
