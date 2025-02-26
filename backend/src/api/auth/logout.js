import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
    localStorage.removeItem('token');
    res.status(200).json({ message: 'Déconnexion réussie.' });
  });


export default router;