// dashboardRoutes.js
import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import User from '../models/User.js';

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  console.log('User ID from token:', req.user.id);

  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User tidak ada' });
    }

    res.json({
      msg: 'Dashboard',
      user: {
        id: user.id,
        username: user.username,
        nama: user.nama,
        sebagai: user.sebagai,
        email: user.email,
        departemen: user.departemen,
      },
    });
  } catch (err) {
    console.error('Error pada dashboard route:', err.message);
    res.status(500).send('Server error->coba cek log terminal');
  }
});

export default router;
