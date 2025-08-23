import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User, { ROLES } from '../models/User.js';
import { nameRule, emailRule, addressRule, passwordRule } from '../middleware/validators.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();

// Signup - Normal User only
router.post('/register', [nameRule, emailRule, addressRule, passwordRule], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { name, email, address, password } = req.body;
  try {
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ message: 'Email already used' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, address, passwordHash, role: ROLES.USER });
    return res.status(201).json({ id: user.id, email: user.email });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email & password required' });
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '8h' });
    return res.json({ token, role: user.role, name: user.name });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
});

router.put('/change-password', authRequired, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) return res.status(400).json({ message: 'oldPassword & newPassword required' });
  // simple policy check for new password (duplicate server-side rule)
  if (!(newPassword.length >= 8 && newPassword.length <= 16 && /[A-Z]/.test(newPassword) && /[^A-Za-z0-9]/.test(newPassword))) {
    return res.status(400).json({ message: 'New password must be 8-16 chars with uppercase & special char' });
  }
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const ok = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Old password incorrect' });
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();
    return res.json({ message: 'Password updated' });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
