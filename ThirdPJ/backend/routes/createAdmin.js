const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const { operationDb } = require('../config/mysql');
const { logAdminAction, ComponentType, ActionType } = require('../utils/adminLogger');

// Create Admin Account
router.post(
  '/',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('password', 'Password is required').not().isEmpty(),
  ],
  async (req, res) => {
    console.log('--- New Request Received ---');
    console.log('Request Headers:', req.headers);
    console.log('Request Body:', req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      // Check if user already exists
      const rows = await operationDb.query('SELECT * FROM admins WHERE username = ?', [username]);
      if (rows.length > 0) {
        return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Insert new admin user
      await operationDb.query('INSERT INTO admins (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, 'admin']);

      // Log the admin creation action
      const creatorAdminId = req.user ? req.user.id : 0; // If auth is implemented, otherwise 0 for initial admin
      const ipAddress = req.ip;
      logAdminAction(
        creatorAdminId, 
        ComponentType.ADMIN_CREATION, 
        ActionType.CREATE_ADMIN, 
        { createdUsername: username }, 
        ipAddress
      );

      res.status(201).json({ message: 'Admin account created successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
