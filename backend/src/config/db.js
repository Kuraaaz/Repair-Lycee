// backend/src/config/db.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'your_password',
  database: process.env.DB_NAME || 'signin',
  waitForConnections: true,
  queueLimit: 0,
});

const pool2 = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME_PROFILE || 'profile',
  waitForConnections: true,
  queueLimit: 0,
});

const pool3 = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME_PLANNING || 'planning',
  waitForConnections: true,
  queueLimit: 0,
});

export { pool, pool2, pool3 };