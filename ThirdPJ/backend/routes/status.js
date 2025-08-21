const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const gameSocketClient = require('../utils/gameSocketClient');
const { setdb, globalDb } = require('../config/mysql');

// @route   GET api/status/game-server-socket
// @desc    Get game server socket connection status
// @access  Private
router.get('/game-server-socket', auth, (req, res) => {
    try {
        res.json({ isConnected: gameSocketClient.isConnected });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/worlds
// @desc    Get all available game worlds
// @access  Private
router.get('/worlds', auth, async (req, res) => {
    try {
        const worlds = await setdb.query(
            `SELECT fld_world_idx as id, fld_name as name 
             FROM setting_world_dbs 
             WHERE fld_type = 2 AND fld_use = 1 
             ORDER BY fld_world_idx`
        );
        res.json(worlds);
    } catch (err) {
        console.error('Failed to fetch worlds:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

// @route   GET api/status/servers
// @desc    Get status for all game servers
// @access  Private
router.get('/servers', auth, async (req, res) => {
    try {
        // 1. Get server list
        const worlds = await setdb.query(
            `SELECT
                d.fld_world_idx as id,
                c.world_name as name
            FROM
                setting_world_dbs d
            JOIN
                setting_world_common c ON d.fld_world_idx = c.world_idx
            WHERE
                d.fld_type = 2 AND d.fld_use = 1
            ORDER BY
                d.fld_world_idx`
        );

        // 2. Get maintenance status
        const [maintenanceStatus] = await setdb.query(
            'SELECT construction, UNIX_TIMESTAMP(construction_starttime) as start_time, UNIX_TIMESTAMP(construction_endtime) as end_time FROM manage_info LIMIT 1'
        );

        // 3. Get latest CCU for each world (MySQL 5.7 compatible)
        const ccuQuery = `
            SELECT t1.fld_world_idx, t1.fld_ccu
            FROM _analysis_ccu_utc t1
            INNER JOIN (
                SELECT fld_world_idx, MAX(fld_date) as max_date
                FROM _analysis_ccu_utc
                WHERE fld_date >= NOW() - INTERVAL 5 MINUTE
                GROUP BY fld_world_idx
            ) t2 ON t1.fld_world_idx = t2.fld_world_idx AND t1.fld_date = t2.max_date;
        `;
        const ccuRows = await globalDb.query(ccuQuery);
        const ccuMap = new Map(ccuRows.map(row => [row.fld_world_idx, row.fld_ccu]));

        // 4. Combine data
        const serverStatuses = worlds.map(world => {
            const ccu = ccuMap.get(world.id) || 0;
            let status = 'Offline'; // Default status

            if (maintenanceStatus && maintenanceStatus.construction === 1) {
                const now = Date.now() / 1000;
                if (now >= maintenanceStatus.start_time && now <= maintenanceStatus.end_time) {
                    status = 'Maintenance';
                }
            } else if (ccu > 0) {
                status = 'Online';
            }

            return {
                name: world.name,
                status: status,
                ccu: ccu,
            };
        });

        res.json(serverStatuses);

    } catch (err) {
        console.error('Failed to fetch server statuses:', err.message);
        res.status(500).send('Server Error');
    }
});
