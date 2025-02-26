import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route pour récupérer le statut admin de l'utilisateur connecté
router.get('/', authenticateToken, (req, res) => {
  if (req.user) {
    // On suppose que votre middleware décode le token et ajoute req.user avec la propriété isAdmin
    return res.json({ isAdmin: req.user.isAdmin });
  } else {
    return res.status(401).json({ message: 'Utilisateur non authentifié' });
  }
});

export default router;
