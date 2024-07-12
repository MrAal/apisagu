import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Barang from '../models/Barang.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

// Mengatur storage engine untuk multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post('/barang', verifyToken, upload.single('gambar'), async (req, res) => {
  try {
    const { title, paragraf } = req.body;
    const { id: adminId } = req.user;
    const gambar = req.file.filename;

    const barang = await Barang.create({ gambar, title, paragraf, adminId });
    res.json(barang);
  } catch (err) {
    console.error('Error creating barang:', err.message);
    res.status(500).send('server eror->periksa log eror');
  }
});

router.get('/barang', async (req, res) => {
  try {
    const { adminId } = req.query; // Ambil adminId dari query string

    // Tambahkan kondisi where untuk filter berdasarkan adminId
    const barangList = await Barang.findAll({
      where: { adminId },
    });

    // Ubah URL gambar menjadi URL lengkap dengan protokol dan host
    const updatedBarangList = barangList.map((barang) => {
      const fullImageUrl = `${req.protocol}://${req.get('host')}/uploads/${barang.gambar}`;
      return { ...barang.dataValues, gambar: fullImageUrl };
    });

    res.json(updatedBarangList);
  } catch (err) {
    console.error('Terjadi kesalahan saat mengambil berita:', err.message);
    res.status(500).send('server eror->periksa log eror');
  }
});

// DELETE berita by ID
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params; // Ambil ID berita dari parameter URL
  const { id: adminId } = req.user; // Ambil adminId dari token yang sudah diverifikasi

  try {
    // Cari berita berdasarkan id dan adminId
    const barang = await Barang.findOne({
      where: {
        id,
        adminId,
      },
    });

    if (!barang) {
      return res.status(404).json({ msg: 'barang not found' });
    }

    const gambarPath = path.join('public/uploads', barang.gambar);

    // Hapus barang dari database
    await barang.destroy();

    // Hapus file gambar dari direktori lokal
    fs.unlink(gambarPath, (err) => {
      if (err) {
        console.error('Error deleting image file:', err.message);
        return res.status(500).send('server eror->periksa log eror');
      }

      res.json({ msg: 'Berita and associated image deleted successfully' });
    });
  } catch (err) {
    console.error('Error deleting berita:', err.message);
    res.status(500).send('server eror->periksa log eror');
  }
});

// PUT update berita by ID
router.put('/:id', verifyToken, upload.single('gambar'), async (req, res) => {
  const { id } = req.params; // Ambil ID berita dari parameter URL
  const { title, paragraf } = req.body;
  const { id: adminId } = req.user; // Ambil adminId dari token yang sudah diverifikasi
  const gambar = req.file ? req.file.filename : null;

  try {
    // Cari berita berdasarkan id dan adminId
    const barang = await Barang.findOne({
      where: {
        id,
        adminId,
      },
    });

    if (!barang) {
      return res.status(404).json({ msg: 'barang not found' });
    }

    // Hapus gambar lama jika ada gambar baru
    if (gambar && barang.gambar) {
      const oldGambarPath = path.join('public/uploads', barang.gambar);
      fs.unlink(oldGambarPath, (err) => {
        if (err) {
          console.error('Error deleting old image file:', err.message);
        }
      });
    }

    // Update barang
    await Barang.update(
      {
        title: title || barang.title,
        paragraf: paragraf || barang.paragraf,
        gambar: gambar || barang.gambar,
      },
      { where: { id, adminId } }
    );

    res.json({ msg: 'barang updated successfully' });
  } catch (err) {
    console.error('Error updating barang:', err.message);
    res.status(500).send('server eror->periksa log eror');
  }
});

export default router;
