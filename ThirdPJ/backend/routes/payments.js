const express = require('express');
const router = express.Router();
const mysql = require('../config/mysql');

// POST /api/payments/history
router.post('/history', async (req, res) => {
  const { filters, pagination } = req.body;
  const page = pagination?.page || 1;
  const limit = pagination?.limit || 20;
  const offset = (page - 1) * limit;

  let whereClauses = [];
  let params = [];

  if (filters) {
    if (filters.timeRange && filters.timeRange.start && filters.timeRange.end) {
      whereClauses.push('reg_time BETWEEN ? AND ?');
      params.push(filters.timeRange.start);
      params.push(filters.timeRange.end);
    }
    if (filters.user_id) {
      whereClauses.push('user_id = ?');
      params.push(filters.user_id);
    }
    if (filters.char_id) {
      whereClauses.push('char_id = ?');
      params.push(filters.char_id);
    }
    if (filters.product_id) {
      whereClauses.push('product_id LIKE ?');
      params.push(`%${filters.product_id}%`);
    }
    if (filters.order_id) {
      whereClauses.push('order_id LIKE ?');
      params.push(`%${filters.order_id}%`);
    }
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const dataQuery = `SELECT * FROM tbl_iap_result ${whereSql} ORDER BY reg_time DESC LIMIT ? OFFSET ?`;
  const countQuery = `SELECT COUNT(*) as count FROM tbl_iap_result ${whereSql}`;

  try {
    const data = await mysql.iapDb.query(dataQuery, [...params, limit, offset]);
    const [countResult] = await mysql.iapDb.query(countQuery, params);
    const count = countResult.count;

    res.json({
      documents: data,
      pagination: {
        page,
        limit,
        totalDocuments: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
