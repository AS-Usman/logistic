-- Day 44: MySQL Database Setup
-- Run this file in MySQL Workbench or the MySQL command line.

CREATE DATABASE IF NOT EXISTS student_management;

USE student_management;

CREATE TABLE IF NOT EXISTS students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    course VARCHAR(100) NOT NULL
);

-- Minimum 5 sample records
INSERT INTO students (name, email, course) VALUES
('Rahul', 'rahul@example.com', 'Python'),
('Priya', 'priya@example.com', 'Data Science'),
('Arun', 'arun@example.com', 'React JS'),
('Sneha', 'sneha@example.com', 'Flask'),
('Kiran', 'kiran@example.com', 'Machine Learning');

-- Verify the records
SELECT * FROM students;
