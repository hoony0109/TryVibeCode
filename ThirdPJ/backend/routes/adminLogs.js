const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');
const { operationDb } = require('../config/mysql');

// @route   GET /api/admin-logs
// @desc    Get admin activity logs with pagination and filtering
// @access  Private (Superadmin only)
router.get('/', [auth, roleAuth(['superadmin'])], async (req, res) => {
    const { page = 1, limit = 20, adminId, componentType, actionType, startDate, endDate, ipAddress } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    let sql = 'SELECT * FROM admin_logs WHERE 1=1';
    let countSql = 'SELECT COUNT(*) as total FROM admin_logs WHERE 1=1';
    const params = [];

    if (adminId) {
        sql += ' AND admin_id = ?';
        countSql += ' AND admin_id = ?';
        params.push(adminId);
    }
    if (componentType) {
        sql += ' AND component_type = ?';
        countSql += ' AND component_type = ?';
        params.push(componentType);
    }
    if (actionType) {
        sql += ' AND action_type = ?';
        countSql += ' AND action_type = ?';
        params.push(actionType);
    }
    if (ipAddress) {
        sql += ' AND ip_address LIKE ?';
        countSql += ' AND ip_address LIKE ?';
        params.push(`%${ipAddress}%`);
    }
    if (startDate) {
        sql += ' AND created_at >= ?';
        countSql += ' AND created_at >= ?';
        params.push(startDate);
    }
    if (endDate) {
        sql += ' AND created_at <= ?';
        countSql += ' AND created_at <= ?';
        params.push(endDate);
    }

    sql += ' ORDER BY created_at DESC, admin_id ASC, idx ASC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    try {
        const logs = await operationDb.query(sql, params);
        console.log('[DEBUG] Fetched logs:', logs);
        const [totalResult] = await operationDb.query(countSql, params.slice(0, params.length - 2)); // Remove limit and offset for count query
        console.log('[DEBUG] Total result:', totalResult);
        const totalLogs = totalResult[0]?.total || 0;

        res.json({
            logs,
            totalLogs,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalLogs / parseInt(limit)),
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
