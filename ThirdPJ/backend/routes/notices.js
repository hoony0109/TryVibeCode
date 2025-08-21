
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');
const { operationDb } = require('../config/mysql');
const { logAdminAction, ComponentType, ActionType } = require('../utils/adminLogger');
const gameSocketClient = require('../utils/gameSocketClient'); // Import the socket client

// @route   GET api/notices
// @desc    Get all notices
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const notices = await operationDb.query('SELECT * FROM notices ORDER BY start_time DESC', []);
        res.json(notices);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/notices
// @desc    Create a new notice
// @access  Private (Admin role required)
router.post('/', [auth, roleAuth(['admin', 'superadmin'])], async (req, res) => {
    const { title, content, startTime, endTime, worldId, isRepeating, repeatCycle } = req.body;
    
    const type = req.body.type ?? 'normal';
    const isActive = req.body.isActive ?? true;
    const author = req.admin.username;

    if (!title || !content || !startTime) {
        return res.status(400).json({ msg: 'Title, content, and startTime are required.' });
    }

    try {
        const formattedStartTime = startTime.replace('T', ' ') + ':00';
        const formattedEndTime = endTime ? endTime.replace('T', ' ') + ':00' : formattedStartTime;

        const sql = `
            INSERT INTO notices (type, title, content, author, start_time, end_time, is_active, world_id, is_repeating, repeat_cycle)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [type, title, content, author, formattedStartTime, formattedEndTime, isActive, worldId || 0, isRepeating, isRepeating ? repeatCycle : 0];
        const result = await operationDb.query(sql, params);

        try {
            const body = {
                noticeId: result.insertId
            };

            await gameSocketClient.send(10041, body);
            console.log(`[Socket] Notice sent to game server for notice ID: ${result.insertId}`);
        } catch (socketErr) {
            console.error('[Socket] Failed to send notice to game server:', socketErr);
        }

        const newNotice = {
            id: result.insertId,
            type,
            title,
            content,
            author,
            start_time: formattedStartTime,
            end_time: formattedEndTime,
            is_active: isActive,
            world_id: worldId || 0,
            is_repeating: isRepeating,
            repeat_cycle: isRepeating ? repeatCycle : 0,
        };

        logAdminAction(
            req.admin.id,
            ComponentType.NOTICE,
            ActionType.CREATE_NOTICE,
            { noticeId: newNotice.id, title: newNotice.title },
            req.ip
        );

        res.status(201).json(newNotice);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/notices/:id
// @desc    Update a notice
// @access  Private (Admin role required)
router.put('/:id', [auth, roleAuth(['admin', 'superadmin'])], async (req, res) => {
    const { id } = req.params;

    try {
        const fieldsToUpdate = {};
        if (req.body.type !== undefined) fieldsToUpdate.type = req.body.type;
        if (req.body.title !== undefined) fieldsToUpdate.title = req.body.title;
        if (req.body.content !== undefined) fieldsToUpdate.content = req.body.content;
        if (req.body.isActive !== undefined) fieldsToUpdate.is_active = req.body.isActive;
        if (req.body.worldId !== undefined) fieldsToUpdate.world_id = req.body.worldId || 0;

        const newStartTime = req.body.startTime ? req.body.startTime.replace('T', ' ') + ':00' : undefined;
        if (newStartTime) {
            fieldsToUpdate.start_time = newStartTime;
        }

        const isRepeating = req.body.isRepeating;
        if (isRepeating !== undefined) {
            fieldsToUpdate.is_repeating = isRepeating;
            if (isRepeating) {
                if(req.body.endTime) {
                    fieldsToUpdate.end_time = req.body.endTime.replace('T', ' ') + ':00';
                }
                fieldsToUpdate.repeat_cycle = req.body.repeatCycle;
            } else {
                const [notice] = await operationDb.query('SELECT start_time FROM notices WHERE id = ?', [id]);
                fieldsToUpdate.end_time = newStartTime || notice.start_time;
                fieldsToUpdate.repeat_cycle = 0;
            }
        }

        if (Object.keys(fieldsToUpdate).length === 0) {
            return res.status(400).json({ msg: 'No fields to update provided.' });
        }

        const setClause = Object.keys(fieldsToUpdate).map(key => `${key} = ?`).join(', ');
        const params = [...Object.values(fieldsToUpdate), id];

        const sql = `UPDATE notices SET ${setClause} WHERE id = ?`;

        await operationDb.query(sql, params);

        try {
            const body = {
                noticeId: id
            };

            await gameSocketClient.send(10041, body);
            console.log(`[Socket] Updated notice sent to game server for notice ID: ${id}`);
        } catch (socketErr) {
            console.error(`[Socket] Failed to send updated notice to game server for notice ID: ${id}`, socketErr);
        }

        const updatedNoticeResult = await operationDb.query('SELECT * FROM notices WHERE id = ?', [id]);
        
        if (updatedNoticeResult.length === 0) {
            return res.status(404).json({ msg: 'Notice not found after update.' });
        }

        logAdminAction(
            req.admin.id,
            ComponentType.NOTICE,
            ActionType.UPDATE_NOTICE,
            { noticeId: id, updatedFields: Object.keys(fieldsToUpdate) },
            req.ip
        );
        
        res.json(updatedNoticeResult[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/notices/:id
// @desc    Delete a notice
// @access  Private (Superadmin role required)
router.delete('/:id', [auth, roleAuth(['superadmin'])], async (req, res) => {
    const { id } = req.params;

    try {
        const [notice] = await operationDb.query('SELECT title FROM notices WHERE id = ?', [id]);
        logAdminAction(
            req.admin.id,
            ComponentType.NOTICE,
            ActionType.DELETE_NOTICE,
            { noticeId: id, title: notice ? notice.title : 'N/A' },
            req.ip
        );

        await operationDb.query('DELETE FROM notices WHERE id = ?', [id]);
        res.json({ msg: 'Notice deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
