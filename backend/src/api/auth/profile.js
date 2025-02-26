import express from 'express';
import { pool2 } from '../../config/db.js';
import { pool } from '../../config/db.js';
import { authenticateToken } from '../../middlewares/authMiddleware.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// GET /api/auth/profile/
// GET /api/auth/profile/
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const [rows] = await pool2.query(
      'SELECT email, nom, prenom, classe FROM profile_users WHERE id = ?',
      [userId]
    );

    if (rows.length === 0) {
      console.log(`Profil introuvable pour l'utilisateur ${userId}, création en cours...`);

      // Récupérer l'email de l'utilisateur s'il est stocké ailleurs (ex: table users)
      const [userRows] = await pool.query(
        'SELECT email FROM users WHERE id = ?',
        [userId]
      );

      if (userRows.length === 0) {
        return res.status(404).json({ error: 'Utilisateur introuvable dans users' });
      }

      const email = userRows[0].email;

      // Créer un profil avec les valeurs vides
      await pool2.query(
        'INSERT INTO profile_users (id, email, nom, prenom, classe) VALUES (?, ?, ?, ?, ?)',
        [userId, email, '', '', '']
      );

      return res.json({ email, nom: '', prenom: '', classe: '' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Erreur lors de la récupération/création du profil :', error);
    res.status(500).json({ error: 'Erreur lors du traitement du profil' });
  }
});


// PUT /api/auth/profile/
router.put('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { nom, prenom, classe } = req.body;
    
    if (!nom || !prenom || !classe) {
      return res.status(400).json({ error: 'Les champs nom, prenom et classe sont requis.' });
    }
    
    const result = await pool2.query(
      `UPDATE profile_users 
       SET nom = ?, prenom = ?, classe = ? 
       WHERE id = ?`,
      [nom, prenom, classe, userId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    
    res.json({ message: 'Profil mis à jour avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil :', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du profil' });
  }
});

export default router;
