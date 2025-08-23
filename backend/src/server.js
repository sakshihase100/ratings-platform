import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { sequelize } from './config/db.js';
import './models/index.js';

import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import storeRoutes from './routes/stores.js';
import ownerRoutes from './routes/owner.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.get('/', (req, res) => res.json({status: 'ok'}));

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/stores', storeRoutes);
app.use('/owner', ownerRoutes);

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('DB connected');
    await sequelize.sync(); // For challenge simplicity; in production use migrations
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
