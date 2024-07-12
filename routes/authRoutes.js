// routes/authRoutes.js
import express from 'express';
import { register, login } from '../controllers/authController.js';
import verifyToken from '../middleware/verifyToken.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.post('/logout', verifyToken, (req, res) => {
    // Tidak ada yang perlu dilakukan di sisi server untuk logout dengan JWT
    // Klien hanya perlu menghapus token dari penyimpanan mereka
    res.json({ msg: 'Logged out successfully' });
    });

    router.put('/admin/:id', verifyToken, async (req, res) => {
        const { id } = req.params;
        const { username, nama, email, password, departemen, sebagai } = req.body;
      
        try {
          console.log('Admin ID:', id); // Log ID
          console.log('Request Body:', req.body); // Log request body
      
          // Cari admin berdasarkan id
          const admin = await User.findByPk(id);
      
          if (!admin) {
            return res.status(404).json({ msg: 'Admin not found' });
          }
      
          // Hash password baru jika ada
          let hashedPassword = admin.password;
          if (password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
          }
      
          // Update data admin
          await User.update(
            {
              username: username || admin.username,
              nama: nama || admin.nama,
              email: email || admin.email,
              password: hashedPassword,
              departemen: departemen || admin.departemen,
              sebagai: sebagai || admin.sebagai
            },
            { where: { id } }
          );
      
          res.json({ msg: 'Admin updated successfully' });
        } catch (err) {
          console.error('Error updating admin:', err.message);
          res.status(500).send('Server error');
        }
      });

export default router;