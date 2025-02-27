-- Active: 1740420235665@@127.0.0.1@3306@signin
CREATE DATABASE IF NOT EXISTS signin;
USE signin;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  isAdmin BOOLEAN DEFAULT FALSE
);

/*Pour foutre les gens adm*/
UPDATE users SET isAdmin = TRUE WHERE email = 'coulymkurama@gmail.com';