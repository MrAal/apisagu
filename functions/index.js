const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();

// Mengatur koneksi ke database (dalam contoh ini menggunakan Sequelize)
const sequelize = new Sequelize('nama_database', 'username_database', 'password_database', {
    host: 'localhost',
    dialect: 'mysql',
  });
  

// Mendefinisikan model untuk entitas Berita
const Berita = sequelize.define('Berita', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  paragraf: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  gambar: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// Middleware untuk menghandle upload file menggunakan multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/tmp/uploads'); // Ganti dengan direktori tempat menyimpan file sementara
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Middleware untuk mengecek token setiap request
const verifyToken = (req, res, next) => {
  // Implementasi verifikasi token di sini
  const token = req.headers.authorization; // Ambil token dari header Authorization
  // Lakukan verifikasi token sesuai kebutuhan
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  // Lakukan logika verifikasi token
  next(); // Lanjutkan ke middleware berikutnya atau handler
};

// Middleware untuk menghandle JSON body
app.use(bodyParser.json());

// Endpoint untuk membuat berita baru
app.post('/api/berita', verifyToken, upload.single('gambar'), async (req, res) => {
  try {
    const { title, paragraf } = req.body;
    const { adminId } = req.user; // Ambil adminId dari token

    // Simpan berita ke dalam database
    const berita = await Berita.create({ title, paragraf, gambar: req.file.filename, adminId });
    res.json(berita);
  } catch (err) {
    console.error('Error creating berita:', err.message);
    res.status(500).send('Server error');
  }
});

// Endpoint untuk mendapatkan semua berita
app.get('/api/berita', async (req, res) => {
  try {
    const { adminId } = req.query;

    // Ambil semua berita dari database berdasarkan adminId
    const beritaList = await Berita.findAll({ where: { adminId } });

    res.json(beritaList);
  } catch (err) {
    console.error('Error fetching berita:', err.message);
    res.status(500).send('Server error');
  }
});

// Endpoint untuk menghapus berita berdasarkan ID
app.delete('/api/berita/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    // Hapus berita dari database berdasarkan ID
    await Berita.destroy({ where: { id } });

    res.json({ message: 'Berita deleted successfully' });
  } catch (err) {
    console.error('Error deleting berita:', err.message);
    res.status(500).send('Server error');
  }
});

// Export Express app sebagai Cloud Function
exports.api = functions.https.onRequest(app);
