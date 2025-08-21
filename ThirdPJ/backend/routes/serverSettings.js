const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');
const { setdb } = require('../config/mysql'); // Use setdb for manage_info and ip_block
const { logAdminAction, ComponentType, ActionType } = require('../utils/adminLogger');
const gameSocketClient = require('../utils/gameSocketClient');

console.log('[DEBUG] serverSettings.js router loaded.'); // Add this line



// Helper to convert BigInt to string for JSON response
BigInt.prototype.toJSON = function() { return this.toString(); };

// @route   GET api/server-settings/info
// @desc    Get current server state (maintenance info)
// @access  Private
router.get('/info', auth, async (req, res) => {
    console.log('[DEBUG] ===== GET /api/server-settings/info ROUTE HIT =====');
    console.log('[DEBUG] Request URL:', req.originalUrl);
    console.log('[DEBUG] Request method:', req.method);
    console.log('[DEBUG] Request headers:', req.headers);
    console.log('[DEBUG] Auth token:', req.header('x-auth-token'));
    
    try {
        // First, check if manage_info table has any data
        let rows = await setdb.query(
            'SELECT construction, UNIX_TIMESTAMP(construction_starttime) as start_time, UNIX_TIMESTAMP(construction_endtime) as end_time FROM manage_info LIMIT 1'
          );
          if (rows.length === 0) { /* insert 후 rows = await setdb.query(...); */ }
          res.json(rows[0]);
          
        console.log('[DEBUG] manage_info query result:', rows);
        
        // If no data exists, insert default data
        if (rows.length === 0) {
            console.log('[DEBUG] No data in manage_info, inserting default data...');
            await setdb.query(
                'INSERT INTO manage_info (client_version, construction, construction_starttime, construction_endtime) VALUES (?, ?, NOW(), NOW())',
                ['1.0.0.0', 0]
            );
            
            // Fetch the newly inserted data
            [rows] = await setdb.query(
                'SELECT construction, UNIX_TIMESTAMP(construction_starttime) as start_time, UNIX_TIMESTAMP(construction_endtime) as end_time FROM manage_info LIMIT 1'
            );
            console.log('[DEBUG] Default data inserted and fetched:', rows);
        }
        
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ msg: 'Server state information not found.' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/server-settings/info
// @desc    Update server state (maintenance mode)
// @access  Private
router.put('/info', auth, async (req, res) => {
    console.log('[DEBUG] PUT /api/server-settings/info called.');
    const { start_time, end_time } = req.body;
    const construction = (start_time && end_time && start_time < end_time) ? 1 : 0;

    if (typeof start_time !== 'number' || typeof end_time !== 'number') {
        return res.status(400).json({ msg: 'start_time and end_time must be Unix timestamps (numbers).' });
    }

    try {
        const result = await setdb.query(
            'UPDATE manage_info SET construction = ?, construction_starttime = FROM_UNIXTIME(?), construction_endtime = FROM_UNIXTIME(?)',
            [construction, start_time, end_time]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Server state not updated.' });
        }

        try {
            const body = { starttime: BigInt(start_time), endtime: BigInt(end_time) };
            await gameSocketClient.send(10053, body);
            console.log(`[Socket] Server state change sent to game server: start=${start_time}, end=${end_time}`);
        } catch (socketErr) {
            console.error('[Socket] Failed to send server state change to game server:', socketErr);
        }

        const [updatedState] = await setdb.query(
            'SELECT construction, UNIX_TIMESTAMP(construction_starttime) as start_time, UNIX_TIMESTAMP(construction_endtime) as end_time FROM manage_info LIMIT 1'
        );

        // Log the action
        logAdminAction(
            req.admin.id,
            ComponentType.SERVER_SETTINGS,
            ActionType.UPDATE_MAINTENANCE,
            { construction, start_time, end_time },
            req.ip
        );

        res.json(updatedState[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/server-settings/ip-block
// @desc    Get all blocked IPs
// @access  Private
router.get('/ip-block', async (req, res) => {
    console.log('[DEBUG] GET /api/server-settings/ip-block called.');
    try {
        const blockedIps = await setdb.query('SELECT ip_address, reason, UNIX_TIMESTAMP(block_time) as block_time, UNIX_TIMESTAMP(block_finish_time) as block_finish_time FROM ip_block', []);
        res.json(blockedIps);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/server-settings/ip-block
// @desc    Add a new IP to block list and notify game server
// @access  Private (Admin role required)
router.post('/ip-block', auth, async (req, res) => {
    console.log('[DEBUG] POST /api/server-settings/ip-block called.');
    const { ip_address, reason, block_hour_time } = req.body; // reason and block_hour_time are optional

    if (!ip_address) {
        return res.status(400).json({ msg: 'IP address is required.' });
    }

    // Default values
    const defaultReason = reason || 0; 
    const defaultBlockHourTime = block_hour_time || 0; // 0 means permanent or until manually released

    try {
        // Insert/Update ip_block table
        const result = await setdb.query(
            'INSERT INTO ip_block (ip_address, reason, block_time, block_finish_time) VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL ? HOUR)) ON DUPLICATE KEY UPDATE reason = VALUES(reason), block_time = NOW(), block_finish_time = DATE_ADD(NOW(), INTERVAL ? HOUR)',
            [ip_address, defaultReason, defaultBlockHourTime, defaultBlockHourTime]
        );

        // Notify game server via socket (MessageID: 10001)
        try {
            const body = {
                nRequestID: BigInt(0), // Placeholder, typically a unique request ID
                nReason: defaultReason,
                nBlockHourTime: defaultBlockHourTime,
                strIPAddress: ip_address
            };
            await gameSocketClient.send(10001, body);
            console.log(`[Socket] IP block sent to game server: ${ip_address}`);
        } catch (socketErr) {
            console.error('[Socket] Failed to send IP block to game server:', socketErr);
        }

        // Fetch updated list to return
        const blockedIps = await setdb.query('SELECT ip_address, reason, UNIX_TIMESTAMP(block_time) as block_time, UNIX_TIMESTAMP(block_finish_time) as block_finish_time FROM ip_block', []);
        
        // Log the action
        logAdminAction(
            req.admin.id,
            ComponentType.IP_BLOCK,
            ActionType.ADD_IP_BLOCK,
            { ip_address, reason: defaultReason, hours: defaultBlockHourTime },
            req.ip
        );

        res.status(201).json(blockedIps);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/server-settings/ip-block/:ip
// @desc    Release an IP from block list and notify game server
// @access  Private (Superadmin role required)
router.delete('/ip-block/:ip', auth, async (req, res) => {
    console.log('[DEBUG] DELETE /api/server-settings/ip-block/:ip called.');
    const { ip } = req.params;

    try {
        const result = await setdb.query('DELETE FROM ip_block WHERE ip_address = ?', [ip]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'IP address not found in block list.' });
        }

        // Notify game server via socket (MessageID: 10003)
        try {
            const body = {
                nRequestID: BigInt(0), // Placeholder
                strIPAddress: ip
            };
            await gameSocketClient.send(10003, body);
            console.log(`[Socket] IP unblock sent to game server: ${ip}`);
        } catch (socketErr) {
            console.error('[Socket] Failed to send IP unblock to game server:', socketErr);
        }

        // Log the action
        logAdminAction(
            req.admin.id,
            ComponentType.IP_BLOCK,
            ActionType.REMOVE_IP_BLOCK,
            { ip_address: ip },
            req.ip
        );

        res.json({ msg: 'IP address unblocked successfully.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
