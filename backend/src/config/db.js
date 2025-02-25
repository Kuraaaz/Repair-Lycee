import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Sotcamontop94!',
  database: process.env.DB_NAME || 'signin',
  waitForConnections: true,
  queueLimit: 0
});

export default pool;