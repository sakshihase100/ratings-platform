import express from 'express';
import { validationResult } from 'express-validator';
import { authRequired, requireRole } from '../middleware/auth.js';
import { listFilters, nameRule, emailRule, addressRule, passwordRule, roleRule } from '../middleware/validators.js';
import User, { ROLES } from '../models/User.js';
import Store from '../models/Store.js';
import Rating from '../models/Rating.js';
import bcrypt from 'bcryptjs';
import { Op, fn, col, literal } from 'sequelize';

const router = express.Router();

// Dashboard
router.get('/dashboard', authRequired, requireRole(ROLES.ADMIN), async (req, res) => {
  const [totalUsers, totalStores, totalRatings] = await Promise.all([
    User.count(),
    Store.count(),
    Rating.count()
  ]);
  return res.json({ totalUsers, totalStores, totalRatings });
});

// Add new user (admin can add normal or admin or owner)
router.post('/users', authRequired, requireRole(ROLES.ADMIN), [nameRule, emailRule, addressRule, passwordRule, roleRule], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { name, email, address, password, role } = req.body;
  try {
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ message: 'Email already used' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, address, passwordHash, role: role || ROLES.USER });
    return res.status(201).json({ id: user.id });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// List users with filters & sorting
router.get('/users', authRequired, requireRole(ROLES.ADMIN), listFilters, async (req, res) => {
  const { name, email, address, role, sortBy='name', order='asc', page=1, pageSize=10 } = req.query;
  const where = {};
  if (name) where.name = { [Op.like]: `%${name}%` };
  if (email) where.email = { [Op.like]: `%${email}%` };
  if (address) where.address = { [Op.like]: `%${address}%` };
  if (role) where.role = role;
  const users = await User.findAndCountAll({
    where,
    order: [[sortBy, order.toUpperCase()]],
    offset: (page-1)*pageSize,
    limit: parseInt(pageSize,10)
  });
  res.json({ count: users.count, rows: users.rows });
});

// View a user details
router.get('/users/:id', authRequired, requireRole(ROLES.ADMIN), async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: 'Not found' });
  if (user.role === ROLES.OWNER) {
    // Fetch owner's store average rating if any
    const store = await Store.findOne({ where: { ownerId: user.id } });
    if (store) {
      const avg = await Rating.findOne({
        where: { StoreId: store.id },
        attributes: [[fn('AVG', col('score')), 'avg']]
      });
      return res.json({ user, ownerStore: store, rating: avg?.get('avg') || 0 });
    }
  }
  res.json({ user });
});

// Add new store
router.post('/stores', authRequired, requireRole(ROLES.ADMIN), [
  // store validations (name/address/email similar to rules)
  nameRule, addressRule, emailRule.optional({ nullable: true })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { name, email, address, ownerId } = req.body;
  try {
    const store = await Store.create({ name, email, address, ownerId: ownerId || null });
    return res.status(201).json({ id: store.id });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// List stores with rating & filters (admin view)
router.get('/stores', authRequired, requireRole(ROLES.ADMIN), listFilters, async (req, res) => {
  const { name, email, address, sortBy='name', order='asc', page=1, pageSize=10 } = req.query;
  const where = {};
  const { Op } = await import('sequelize');
  if (name) where.name = { [Op.like]: `%${name}%` };
  if (email) where.email = { [Op.like]: `%${email}%` };
  if (address) where.address = { [Op.like]: `%${address}%` };

  // Include average rating via subquery
  const stores = await Store.findAndCountAll({
    where,
    order: [[sortBy, order.toUpperCase()]],
    offset: (page-1)*pageSize,
    limit: parseInt(pageSize,10),
    attributes: {
      include: [
        [fn('IFNULL', literal('(SELECT AVG(score) FROM ratings WHERE ratings.StoreId = Store.id)'), 0), 'avgRating']
      ]
    }
  });
  res.json({ count: stores.count, rows: stores.rows });
});

export default router;
