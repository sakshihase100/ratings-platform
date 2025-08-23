import dotenv from 'dotenv';
import { sequelize } from './config/db.js';
import './models/index.js';

dotenv.config();
(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('DB synced');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
