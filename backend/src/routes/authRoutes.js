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


// Route pour l'inscription
import signupRoutes from '../api/auth/signup.js';
router.use('/signup', signupRoutes)

// Route pour la connexion
import loginRoutes from '../api/auth/login.js';
router.use('/login', loginRoutes); 

import logoutRoutes from '../api/auth/logout.js';
router.post('/logout', logoutRoutes);

import profileRoutes from '../api/auth/profile.js';
router.use('/profile', profileRoutes);

import planningRoutes from '../api/planning.js';
router.use('/planning', planningRoutes);

import admRoutes from '../api/adm.js';
router.use('/adm', admRoutes);

export default router;
