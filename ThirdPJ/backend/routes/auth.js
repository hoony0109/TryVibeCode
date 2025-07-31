const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const mysql = require('../config/mysql');
const redis = require('../config/redis');
const auth = require('../middleware/auth');
const { logActivity } = require('../models/Log');

// Admin Login
router.post(
  '/login',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('password', 'Password is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

  try {
    const [rows] = await mysql.execute('SELECT * FROM admins WHERE username = ?', [username]);
    const admin = rows[0];

    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = {
      admin: {
        id: admin.id,
        role: admin.role,
      },
    };

    jwt.sign(
      payload,
      process.env.SECRET_KEY,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        logActivity(admin.id, 'Admin Login', { username: admin.username });
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Admin Logout
router.post('/logout', auth, async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    // Blacklist the token in Redis
    await redis.set(token, 'blacklisted', 'EX', 3600); // Token expires in 1 hour
    logActivity(req.admin.id, 'Admin Logout');
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const [rows] = await operationDb.query('SELECT id, username, role FROM admins WHERE id = ?', [req.admin.id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
