const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { operationDb, gameDb, iapDb, globalDb } = require('../config/mysql');

// @route   GET api/stats/kpis
// @desc    Get Key Performance Indicators
// @access  Private
router.get('/kpis', auth, async (req, res) => {
    try {
        const totalPlayersQuery = `SELECT COUNT(*) as count FROM line_account`;
        const newUsersTodayQuery = `SELECT COUNT(*) as count FROM line_account WHERE DATE(reg_date) = CURDATE()`;
        const dauQuery = `SELECT COUNT(DISTINCT user_id) as count FROM _analysis_login WHERE DATE(fld_date) = CURDATE()`;
        const mauQuery = `SELECT COUNT(DISTINCT user_id) as count FROM _analysis_login WHERE YEAR(fld_date) = YEAR(CURDATE()) AND MONTH(fld_date) = MONTH(CURDATE())`;
        const ccuQuery = `SELECT SUM(fld_ccu) as count FROM _analysis_ccu_utc WHERE fld_date >= NOW() - INTERVAL 5 MINUTE`;

        const [totalPlayersRow] = await globalDb.query(totalPlayersQuery);
        const [newUsersTodayRow] = await globalDb.query(newUsersTodayQuery);
        const [dauRow] = await globalDb.query(dauQuery);
        const [mauRow] = await globalDb.query(mauQuery);
        const [ccuRow] = await globalDb.query(ccuQuery);

        const kpiData = {
            totalPlayers: totalPlayersRow?.count || 0,
            dau: dauRow?.count || 0,
            currentOnline: ccuRow?.count || 0,
            newUsersToday: newUsersTodayRow?.count || 0,
            mau: mauRow?.count || 0,
        };

        res.json(kpiData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   GET api/stats/ccu-trend
// @desc    Get CCU trend data for charts
// @access  Private
router.get('/ccu-trend', auth, async (req, res) => {
    try {
        const ccuTrendQuery = `
            SELECT DATE_FORMAT(fld_date, '%Y-%m-%dT%H:00:00.000Z') as time, SUM(fld_ccu) as value
            FROM _analysis_ccu_utc
            WHERE fld_date >= NOW() - INTERVAL 24 HOUR
            GROUP BY DATE_FORMAT(fld_date, '%Y-%m-%dT%H:00:00.000Z')
            ORDER BY time;
        `;
        const ccuData = await globalDb.query(ccuTrendQuery);
        res.json(ccuData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/stats/dau-trend
// @desc    Get DAU trend data for charts
// @access  Private
router.get('/dau-trend', auth, async (req, res) => {
    try {
        const dauTrendQuery = `
            SELECT DATE(fld_date) as date, COUNT(DISTINCT user_id) as value
            FROM _analysis_login
            WHERE fld_date >= NOW() - INTERVAL 30 DAY
            GROUP BY DATE(fld_date)
            ORDER BY date;
        `;
        const dauData = await globalDb.query(dauTrendQuery);
        res.json(dauData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/stats/total-players-trend
// @desc    Get total players trend data for charts
// @access  Private
router.get('/total-players-trend', auth, async (req, res) => {
    try {
        const totalPlayersTrendQuery = `
            SELECT DATE_FORMAT(reg_date, '%Y-%m') as month, COUNT(*) as registered_count
            FROM line_account
            WHERE reg_date >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
            GROUP BY DATE_FORMAT(reg_date, '%Y-%m')
            ORDER BY month;
        `;
        const monthlyData = await globalDb.query(totalPlayersTrendQuery);

        // Calculate cumulative total
        let cumulativeTotal = 0;
        const trendData = monthlyData.map(row => {
            cumulativeTotal += row.registered_count;
            return {
                month: new Date(row.month).toLocaleString('default', { month: 'short' }),
                value: cumulativeTotal
            };
        });

        // To get the total before the 12 month window, we need one more query
        const totalBeforeQuery = `
            SELECT COUNT(*) as count
            FROM line_account
            WHERE reg_date < DATE_SUB(NOW(), INTERVAL 12 MONTH)
        `;
        const [totalBeforeRow] = await globalDb.query(totalBeforeQuery);
        const totalBefore = totalBeforeRow?.count || 0;

        // Add the 'before' count to all subsequent months
        const finalTrendData = trendData.map(row => ({
            ...row,
            value: row.value + totalBefore
        }));

        res.json(finalTrendData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/stats/payment-summary
// @desc    Get payment summary statistics
// @access  Private
router.get('/payment-summary', auth, async (req, res) => {
    try {
        const todayRevenueQuery = `
            SELECT SUM(p.price) as totalRevenue
            FROM tbl_iap_result r
            JOIN tbl_iap_price p ON r.product_id = p.product_id
            WHERE r.give_complete = 2 AND DATE(r.reg_time) = CURDATE()
        `;

        const monthRevenueQuery = `
            SELECT SUM(p.price) as totalRevenue
            FROM tbl_iap_result r
            JOIN tbl_iap_price p ON r.product_id = p.product_id
            WHERE r.give_complete = 2 AND YEAR(r.reg_time) = YEAR(CURDATE()) AND MONTH(r.reg_time) = MONTH(CURDATE())
        `;

        const todayPurchasesQuery = `
            SELECT COUNT(*) as purchaseCount
            FROM tbl_iap_result
            WHERE give_complete = 2 AND DATE(reg_time) = CURDATE()
        `;

        const [todayRevenueRow] = await iapDb.query(todayRevenueQuery);
        const [monthRevenueRow] = await iapDb.query(monthRevenueQuery);
        const [todayPurchasesRow] = await iapDb.query(todayPurchasesQuery);

        const paymentSummary = {
            todayRevenue: todayRevenueRow?.totalRevenue || 0,
            monthRevenue: monthRevenueRow?.totalRevenue || 0,
            todayPurchases: todayPurchasesRow?.purchaseCount || 0,
        };

        res.json(paymentSummary);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
