import { body, query } from 'express-validator';

// Name: Min 20, Max 60
export const nameRule = body('name')
  .isString().withMessage('Name required')
  .isLength({ min: 20, max: 60 }).withMessage('Name must be 20-60 characters');

// Address: Max 400
export const addressRule = body('address')
  .optional({ nullable: true })
  .isLength({ max: 400 }).withMessage('Address max 400 characters');

// Password: 8-16 with at least 1 uppercase and 1 special char
export const passwordRule = body('password')
  .isLength({ min: 8, max: 16 }).withMessage('Password must be 8-16 chars')
  .matches(/[A-Z]/).withMessage('Password must include an uppercase letter')
  .matches(/[^A-Za-z0-9]/).withMessage('Password must include a special character');

export const emailRule = body('email').isEmail().withMessage('Valid email required');

export const roleRule = body('role').optional().isIn(['ADMIN','USER','OWNER']).withMessage('Invalid role');

export const ratingRule = body('score').isInt({ min: 1, max: 5 }).withMessage('Score 1-5');

// Filters & sorting
export const listFilters = [
  query('name').optional().isString(),
  query('email').optional().isString(),
  query('address').optional().isString(),
  query('role').optional().isIn(['ADMIN','USER','OWNER']),
  query('sortBy').optional().isIn(['name', 'email', 'address', 'role', 'rating']),
  query('order').optional().isIn(['asc','desc']),
  query('page').optional().isInt({min:1}),
  query('pageSize').optional().isInt({min:1, max:100})
];
