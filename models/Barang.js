// models/Berita.js
import { DataTypes } from 'sequelize';
import db from '../db.js';
import User from './User.js';

const Barang = db.define('Barang', {
  gambar: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  paragraf: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  adminId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
    allowNull: false,
  },
}, {
  timestamps: true,
});

User.hasMany(Barang, { foreignKey: 'adminId' });
Barang.belongsTo(User, { foreignKey: 'adminId' });

export default Barang;
