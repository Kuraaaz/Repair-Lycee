import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../../config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const TOKEN_EXPIRATION_SHORT = '1m';
const TOKEN_EXPIRATION_LONG = '365d';

router.post('/', async (req, res) => {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis.' });
    }

    try {
        // Vérifie si user existe dja
        const [existingUser] = await pool.execute(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({ error: 'Utilisateur déjà existant.' });
        }

        // Hachage pass
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insertion dans la bdd, isAdmin = 0 par def
        const [result] = await pool.execute(
            'INSERT INTO users (email, password, isAdmin) VALUES (?, ?, ?)',
            [email, hashedPassword, 0]
        );

        const [user] = await pool.execute(
            'SELECT id, isAdmin FROM users WHERE email = ?',
            [email]
        );

        if (user.length === 0) {
            return res.status(500).json({ error: "Erreur lors de la récupération de l'utilisateur." });
        }

        const tokenExpiration = rememberMe ? TOKEN_EXPIRATION_LONG : TOKEN_EXPIRATION_SHORT;

        const token = jwt.sign(
            { 
              userId: user[0].id, 
              email, 
              isAdmin: user[0].isAdmin
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: tokenExpiration }
          );          

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: rememberMe ? 365 * 24 * 60 * 60 * 1000 : 3600000
        });

        res.status(201).json({ message: 'Utilisateur créé avec succès.', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur interne du serveur.' });
    }
});

export default router;
