import express from 'express';
import { authRequired, requireRole } from '../middleware/auth.js';
import { ROLES } from '../models/User.js';
import Store from '../models/Store.js';
import Rating from '../models/Rating.js';
import User from '../models/User.js';
import { fn, col } from 'sequelize';

const router = express.Router();

// Owner dashboard - list users who rated their store & average rating
router.get('/dashboard', authRequired, requireRole(ROLES.OWNER), async (req, res) => {
  const store = await Store.findOne({ where: { ownerId: req.user.id } });
  if (!store) return res.status(404).json({ message: 'No store linked to owner' });

  const ratings = await Rating.findAll({ where: { StoreId: store.id }, include: [{ model: User, attributes: ['id','name','email','address'] }] });
  const avgWrap = await Rating.findAll({
    where: { StoreId: store.id },
    attributes: [[fn('AVG', col('score')), 'avg']]
  });
  const avg = avgWrap?.[0]?.get('avg') || 0;
  res.json({ store, average: Number(avg).toFixed(2), raters: ratings });
});

export default router;
