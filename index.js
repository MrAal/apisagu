import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import db from './db.js';
import authRoutes from './routes/authRoutes.js';
import barangRoutes from './routes/barangRoutes.js';

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(process.cwd(), 'public')));

db.authenticate()
  .then(() => {
    console.log('Database connected...');
    return db.sync({ alter: true });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

app.use('/api/auth', authRoutes);
app.use('/api', barangRoutes);
app.use('/api/barang', barangRoutes);


const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});