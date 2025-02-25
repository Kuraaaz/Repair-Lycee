// backend/src/app.js
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const port = process.env.PORT || 5000;
const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Ajustez en fonction de votre frontend
  credentials: true,               // Autoriser l'envoi de cookies
}));
app.use(express.json());
app.use(cookieParser());

// Utilisation de la route d'authentification
app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});