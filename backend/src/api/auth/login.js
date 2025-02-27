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
    // Récup l'user dans la db
    const [user] = await pool.execute('SELECT id, password, isAdmin FROM users WHERE email = ?', [email]);

    if (user.length === 0) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
    }

    // Check pass
    const isPasswordValid = await bcrypt.compare(password, user[0].password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
    }

    // Validité token
    const tokenExpiration = rememberMe ? TOKEN_EXPIRATION_LONG : TOKEN_EXPIRATION_SHORT;

    // Créer un nouveau token avec le "isAdmin" mis à jour
    const token = jwt.sign(
      { 
        userId: user[0].id, 
        email, 
        isAdmin: user[0].isAdmin  // isAdmin de con sinon ça marche pas (ça m'a pris 8h anis.)
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: tokenExpiration }
    );

    // Token dans un cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: rememberMe ? 365 * 24 * 60 * 60 * 1000 : 3600000, // Si "rememberMe" token => 1an sinon 1h
    });

    res.status(200).json({ message: 'Connexion réussie.', token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
});

export default router;
