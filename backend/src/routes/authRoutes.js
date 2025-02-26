import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { authenticateToken } from '../middlewares/authMiddleware.js';

dotenv.config();
const router = express.Router();

// Middleware pour parser les cookies
router.use(cookieParser());

// Durées des tokens
const TOKEN_EXPIRATION_SHORT = '1h';
const TOKEN_EXPIRATION_LONG = '365d';

// Route pour l'inscription
router.post('/signup', async (req, res) => {
  const { email, password, rememberMe } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis.' });
  }
  try {
    // Vérifier si l'utilisateur existe déjà
    const [existingUser] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'Utilisateur déjà existant.' });
    }
    // Hachage du mot de passe
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // Insertion dans la base
    const [result] = await pool.execute('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
    const tokenExpiration = rememberMe ? TOKEN_EXPIRATION_LONG : TOKEN_EXPIRATION_SHORT;
    const token = jwt.sign({ userId: result.insertId, email }, process.env.JWT_SECRET, { expiresIn: tokenExpiration });
    // Création du cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: rememberMe ? 365 * 24 * 60 * 60 * 1000 : 3600000,
    });
    res.status(201).json({ message: 'Utilisateur créé avec succès.', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
});

// Route pour la connexion
router.post('/login', async (req, res) => {
  const { email, password, rememberMe } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis.' });
  }
  try {
    const [user] = await pool.execute('SELECT id, password FROM users WHERE email = ?', [email]);
    if (user.length === 0) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
    }
    const isPasswordValid = await bcrypt.compare(password, user[0].password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
    }
    const tokenExpiration = rememberMe ? TOKEN_EXPIRATION_LONG : TOKEN_EXPIRATION_SHORT;
    const token = jwt.sign({ userId: user[0].id, email }, process.env.JWT_SECRET, { expiresIn: tokenExpiration });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: rememberMe ? 365 * 24 * 60 * 60 * 1000 : 3600000,
    });
    res.status(200).json({ message: 'Connexion réussie.', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
});

// Route pour la déconnexion
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });
  res.status(200).json({ message: 'Déconnexion réussie.' });
});

import profileRoutes from '../api/auth/profile.js';
router.use('/profile', profileRoutes);

export default router;
