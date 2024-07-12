// models/User.js
import { DataTypes } from 'sequelize';
import db from '../db.js'; // Sesuaikan dengan lokasi koneksi Sequelize Anda

const User = db.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: false, // Menonaktifkan createdAt dan updatedAt
});

export default User;
