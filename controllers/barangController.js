import Barang from '../models/Barang.js';
import User from '../models/User.js';

export const addBarang = async (req, res) => {
  const { title, paragraf, adminId } = req.body;
  const gambar = req.file.filename;

  try {
    const user = await User.findByPk(adminId);
    if (!user) {
      return res.status(404).json({ msg: 'Admin not found' });
    }

    const barang = await Barang.create({
      gambar,
      title,
      paragraf,
      adminId,
    });

    res.status(201).json(barang);
  } catch (err) {
    console.error('Error adding barang:', err.message);
    res.status(500).send('Server error');
  }
};

export const getAllBarang = async (req, res) => {
  try {
    const barangList = await Barang.findAll();
    res.json(barangList);
  } catch (err) {
    console.error('Error getting barang:', err.message);
    res.status(500).send('Server error');
  }
};

export const getBarangById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const barang = await Barang.findByPk(id);
    if (!barang) {
      return res.status(404).json({ msg: 'barang not found' });
    }

    res.json(barang);
  } catch (err) {
    console.error('Error getting barang:', err.message);
    res.status(500).send('Server error');
  }
};
