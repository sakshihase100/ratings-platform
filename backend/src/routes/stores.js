import express from 'express';
import { authRequired } from '../middleware/auth.js';
import { ratingRule } from '../middleware/validators.js';
import { validationResult } from 'express-validator';
import Store from '../models/Store.js';
import Rating from '../models/Rating.js';
import { Op, fn, col, literal } from 'sequelize';

const router = express.Router();

// List all registered stores (visible to any logged-in user)
// Supports search by name/address; returns overall rating and the current user's rating
router.get('/', authRequired, async (req, res) => {
  const { search = '', page=1, pageSize=10, sortBy='name', order='asc' } = req.query;
  const where = {};
  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { address: { [Op.like]: `%${search}%` } }
    ];
  }
  const stores = await Store.findAndCountAll({
    where,
    order: [[sortBy, order.toUpperCase()]],
    offset: (page-1)*pageSize,
    limit: parseInt(pageSize,10),
    attributes: {
      include: [
        [fn('IFNULL', literal('(SELECT AVG(score) FROM ratings WHERE ratings.StoreId = Store.id)'), 0), 'avgRating'],
        [fn('IFNULL', literal(`(SELECT score FROM ratings WHERE ratings.StoreId = Store.id AND ratings.UserId = ${req.user.id} LIMIT 1)`), 0), 'myRating']
      ]
    }
  });
  res.json({ count: stores.count, rows: stores.rows });
});

// Submit or modify rating for a store
router.post('/:id/rate', authRequired, [ratingRule], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const storeId = parseInt(req.params.id, 10);
  const userId = req.user.id;
  const { score } = req.body;
  try {
    const [rating, created] = await Rating.findOrCreate({
      where: { StoreId: storeId, UserId: userId },
      defaults: { score }
    });
    if (!created) {
      rating.score = score;
      await rating.save();
    }
    return res.json({ message: created ? 'Rating submitted' : 'Rating updated', score: rating.score });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
