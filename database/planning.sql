CREATE DATABASE IF NOT EXISTS planning;
USE planning;

CREATE TABLE IF NOT EXISTS planning (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    disponibilite VARCHAR(255) NOT NULL
  )