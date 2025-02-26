import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const tokenFromHeader = authHeader && authHeader.split(' ')[1];
  const tokenFromCookie = req.cookies.token;
  
  const token = tokenFromHeader || tokenFromCookie;
  
  if (!token) {
    return res.status(401).json({ error: 'Accès refusé. Veuillez vous connecter.' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("Erreur lors de la vérification du token :", err);
      return res.status(403).json({ error: 'Token invalide', details: err.message });
    }
    req.user = user;
    next();
  });
}  