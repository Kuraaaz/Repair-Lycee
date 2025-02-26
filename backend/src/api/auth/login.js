import express from 'express';
import { pool } from '../../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const TOKEN_EXPIRATION_SHORT = '1h';
const TOKEN_EXPIRATION_LONG = '365d';

router.post('/', async (req, res) => {
  const { email, password, rememberMe } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis.' });
  }

  try {
    // Récupérer l'utilisateur de la base de données
    const [user] = await pool.execute('SELECT id, password, isAdmin FROM users WHERE email = ?', [email]);

    if (user.length === 0) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user[0].password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
    }

    // Déterminer la durée de validité du token en fonction du "rememberMe"
    const tokenExpiration = rememberMe ? TOKEN_EXPIRATION_LONG : TOKEN_EXPIRATION_SHORT;

    // Créer un nouveau token avec le "isAdmin" mis à jour
    const token = jwt.sign(
      { 
        userId: user[0].id, 
        email, 
        isAdmin: user[0].isAdmin  // S'assurer que isAdmin est inclus ici
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: tokenExpiration }
    );

    // Définir le token dans un cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: rememberMe ? 365 * 24 * 60 * 60 * 1000 : 3600000, // Si "rememberMe" est vrai, le cookie est conservé un an
    });

    // Répondre avec le message de succès et le token
    res.status(200).json({ message: 'Connexion réussie.', token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
});

export default router;
