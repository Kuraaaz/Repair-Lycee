import express from 'express';
import { pool3 } from '../config/db.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// GET : Récupérer le planning
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool3.query('SELECT * FROM planning ORDER BY date ASC');
    res.json(rows);
  } catch (error) {
    console.error('Erreur lors de la récupération du planning :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// PUT : Modifier le planning
router.put('/', authenticateToken, async (req, res) => {
  console.log("Requête reçue :", req.body);

  // On vérifie si le payload est directement un tableau ou enveloppé dans un objet
  let planning = [];
  if (Array.isArray(req.body)) {
    planning = req.body;
  } else if (req.body.planning && Array.isArray(req.body.planning)) {
    planning = req.body.planning;
  } else {
    return res.status(400).json({ error: "Format invalide : un tableau de planning est attendu" });
  }

  try {
    await Promise.all(
      planning.map(async (item) => {
        await pool3.query(
          'UPDATE planning SET date = ?, disponibilite = ? WHERE id = ?',
          [item.date, item.disponibilite, item.id]
        );
      })
    );
    res.json({ message: 'Planning mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du planning :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;
