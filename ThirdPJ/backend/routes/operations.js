const express = require('express');
const router = express.Router();
const { operationDb } = require('../config/mysql');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');

// @route   GET /api/operations/admins
// @desc    Get all admin accounts
// @access  Private (Superadmin only)
router.get('/admins', [auth, roleAuth(['superadmin'])], async (req, res) => {
  try {
    const admins = await operationDb.query('SELECT id, username, role, created_at FROM admins');
    res.json(admins);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/operations/admins/:id/role
// @desc    Update admin role
// @access  Private (Superadmin only)
router.put('/admins/:id/role', [auth, roleAuth(['superadmin'])], async (req, res) => {
  const { role } = req.body;
  const { id } = req.params;

  // Basic validation
  if (!role || !['admin', 'superadmin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role specified.' });
  }

  try {
    // Prevent a superadmin from changing their own role
    if (req.admin.id === parseInt(id, 10)) {
        return res.status(400).json({ message: 'Superadmins cannot change their own role.' });
    }

    // Fetch the current role of the admin being updated
    const [targetAdmin] = await operationDb.query('SELECT role FROM admins WHERE id = ?', [id]);

    if (!targetAdmin) {
        return res.status(404).json({ message: 'Admin not found.' });
    }

    // Prevent a superadmin from demoting another superadmin
    if (targetAdmin.role === 'superadmin' && role === 'admin') {
        return res.status(403).json({ message: 'Superadmins cannot demote other superadmins.' });
    }

    const result = await operationDb.query('UPDATE admins SET role = ? WHERE id = ?', [role, id]);

    if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Admin not found or no changes made.' });
    }

    res.json({ message: 'Admin role updated successfully.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
