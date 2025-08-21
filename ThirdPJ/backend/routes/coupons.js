
const express = require('express');
const router = express.Router();
const { customAlphabet } = require('nanoid');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');
const { operationDb } = require('../config/mysql');
const { logAdminAction, ComponentType, ActionType } = require('../utils/adminLogger');

// @route   GET api/coupons
// @desc    Get all coupon events
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const coupons = await operationDb.query('SELECT * FROM coupons ORDER BY created_at DESC', []);
        res.json(coupons);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/coupons
// @desc    Create a new coupon event and generate codes
// @access  Private (Admin role required)
router.post('/', [auth, roleAuth(['admin', 'superadmin'])], async (req, res) => {
    const { eventName, rewardItems, quantity, usageLimit, startDate, endDate } = req.body;
    const author = req.admin.username;

    // --- Start of Debugging & Validation ---
    console.log('[DEBUG] Received coupon creation request with quantity:', quantity, '(type:', typeof quantity, ')');
    const numericQuantity = parseInt(quantity, 10);

    if (isNaN(numericQuantity) || numericQuantity <= 0) {
        return res.status(400).json({ msg: 'Invalid or missing quantity. It must be a positive number.' });
    }
    // --- End of Debugging & Validation ---

    try {
        // 1. Create the master coupon event
        const formattedStartDate = startDate.replace('T', ' ') + ':00';
        const formattedEndDate = endDate.replace('T', ' ') + ':00';

        const insertCouponSql = `
            INSERT INTO coupons (event_name, reward_items, quantity, usage_limit_per_user, start_date, end_date, author)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const insertCouponParams = [
            eventName,
            JSON.stringify(rewardItems), // Stringify JSON for DB
            numericQuantity, // Use the validated numeric quantity
            usageLimit,
            formattedStartDate,
            formattedEndDate,
            author
        ];

        const result = await operationDb.query(insertCouponSql, insertCouponParams);
        const couponId = result.insertId;

        // 2. Generate unique coupon codes
        const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 12);
        const codes = [];
        for (let i = 0; i < numericQuantity; i++) { // Use the validated numeric quantity
            codes.push([couponId, nanoid()]);
        }
        console.log(`[DEBUG] Generated ${codes.length} coupon codes.`);

        // 3. Bulk insert codes into coupon_codes table
        if (codes.length > 0) {
            // Build the query dynamically for robust bulk insertion
            const placeholders = codes.map(() => '(?, ?)').join(', ');
            const flatParams = codes.flat();
            const sql = `INSERT INTO coupon_codes (coupon_id, code) VALUES ${placeholders}`;
            await operationDb.query(sql, flatParams);
        }

        // Log the action
        logAdminAction(
            req.admin.id,
            ComponentType.COUPON,
            ActionType.CREATE_COUPON_EVENT,
            { couponId, eventName, quantity: numericQuantity },
            req.ip
        );

        res.status(201).json({ msg: `${numericQuantity} coupon codes created successfully for event: ${eventName}` });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/coupons/:id/codes
// @desc    Get all codes for a specific coupon event
// @access  Private
router.get('/:id/codes', auth, async (req, res) => {
    const { id } = req.params;
    try {
        const codes = await operationDb.query('SELECT * FROM coupon_codes WHERE coupon_id = ?', [id]);
        res.json(codes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
