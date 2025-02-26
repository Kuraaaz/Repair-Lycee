import express from 'express';
import { pool3 } from '../config/db.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Récupérer le planning
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool3.query('SELECT * FROM planning ORDER BY date ASC');
        res.json(rows);
    } catch (error) {
        console.error('Erreur lors de la récupération du planning :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Modifier le planning (Réservé aux admins)
router.put('/', authenticateToken, async (req, res) => {
    const { planning } = req.body;

    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ message: "Accès refusé, vous n'êtes pas administrateur." });
    }

    try {
        await Promise.all(planning.map(async (item) => {
            await pool3.query('UPDATE planning SET disponiblite = ? WHERE date = ?', [item.disponiblite, item.date]);
        }));

        res.json({ message: 'Planning mis à jour avec succès' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du planning :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

export default router;