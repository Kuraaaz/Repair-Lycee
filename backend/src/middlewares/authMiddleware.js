// backend/src/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const authenticateToken = (req, res, next) => {
  // Récupérer le token depuis le cookie
  const token = localStorage.getItem('token');

  if (!token) {
    return res.status(401).json({ error: 'Accès refusé. Veuillez vous connecter.' });
  }

  // Vérifier le token avec la clé secrète
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token invalide.' });
    }

    // Si le token est valide, ajouter les informations utilisateur à la requête
    req.user = user; 
    next(); // Passer au middleware suivant ou à la route
  });
};
