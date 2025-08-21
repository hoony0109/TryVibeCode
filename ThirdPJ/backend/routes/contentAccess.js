const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');
const { operationDb } = require('../config/mysql');
const { logAdminAction, ComponentType, ActionType } = require('../utils/adminLogger');
const gameSocketClient = require('../utils/gameSocketClient');

// @route   GET api/content-access
// @desc    Get all content access controls
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const contentControls = await operationDb.query('SELECT * FROM content_access_control', []);
        console.log('[DEBUG] Content controls fetched from DB:', contentControls);
        res.json(contentControls);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/content-access/:id
// @desc    Update content access control (enable/disable)
// @access  Private (Admin role required)
router.put('/:id', [auth, roleAuth(['admin', 'superadmin'])], async (req, res) => {
    const { id } = req.params;
    const { is_enabled } = req.body;
    const last_updated_by = req.admin.username; // Get author from logged-in admin

    if (typeof is_enabled !== 'boolean') {
        return res.status(400).json({ msg: 'is_enabled must be a boolean value.' });
    }

    try {
        const result = await operationDb.query(
            'UPDATE content_access_control SET is_enabled = ?, last_updated_by = ? WHERE id = ?',
            [is_enabled, last_updated_by, id]
        );
        console.log('[DEBUG] Update affectedRows:', result.affectedRows);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Content control not found or no changes applied.' });
        }

        // Fetch the complete updated control to return it in the response
        const [updatedControlRows] = await operationDb.query('SELECT * FROM content_access_control WHERE id = ?', [id]);
        console.log('[DEBUG] updatedControlRows from SELECT after UPDATE:', updatedControlRows);
        
        let updatedControl;
        if (Array.isArray(updatedControlRows) && updatedControlRows.length > 0) {
            updatedControl = updatedControlRows[0];
        } else if (updatedControlRows && typeof updatedControlRows === 'object' && updatedControlRows.id) {
            // Handle case where query returns a single object directly (not an array)
            updatedControl = updatedControlRows;
        } else {
            return res.status(404).json({ msg: 'Content control not found after update.' });
        }

        // --- Send content access change to game server via socket ---
        try {
            const worldId = 1; // TODO: Make this dynamic if needed
            const messageId = 11081; // MessageID for content access control
            const body = {
                WorldID: worldId,
                contentId: updatedControl.id,
                isEnabled: updatedControl.is_enabled ? 1 : 0 // Convert boolean to 0 or 1
            };
            await gameSocketClient.send(messageId, body);
            console.log(`[Socket] Content access change sent to game server for content ID: ${updatedControl.id}`);
        } catch (socketErr) {
            console.error('[Socket] Failed to send content access change to game server:', socketErr);
        }
        // -----------------------------------------------------------

        // Log the action
        logAdminAction(
            req.admin.id,
            ComponentType.CONTENT_ACCESS,
            ActionType.UPDATE_CONTENT_ACCESS,
            { contentId: updatedControl.id, contentName: updatedControl.content_name, isEnabled: updatedControl.is_enabled },
            req.ip
        );

        res.json(updatedControl);
        console.log('[DEBUG] Sending response to frontend:', updatedControl);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/content-access/add
// @desc    Add a new content type
// @access  Private (Admin role required)
router.post('/add', [auth, roleAuth(['admin', 'superadmin'])], async (req, res) => {
    const { content_name } = req.body;
    const last_updated_by = req.admin.username;

    if (!content_name) {
        return res.status(400).json({ msg: 'Content name is required.' });
    }

    try {
        const [existingRows] = await operationDb.query('SELECT id FROM content_access_control WHERE content_name = ?', [content_name]);
        if (existingRows && existingRows.length > 0) {
            return res.status(409).json({ msg: 'Content name already exists.' });
        }

        const result = await operationDb.query(
            'INSERT INTO content_access_control (content_name, last_updated_by) VALUES (?, ?)',
            [content_name, last_updated_by]
        );

        const [newContentRows] = await operationDb.query('SELECT * FROM content_access_control WHERE id = ?', [result.insertId]);
        let newContent;
        if (Array.isArray(newContentRows) && newContentRows.length > 0) {
            newContent = newContentRows[0];
        } else if (newContentRows && typeof newContentRows === 'object' && newContentRows.id) {
            // Handle case where query returns a single object directly (not an array)
            newContent = newContentRows;
        } else {
            console.error('Failed to retrieve newly added content.');
            return res.status(500).send('Server Error: Failed to retrieve new content.');
        }
        console.log('New content added:', newContent);

        // Log the action
        logAdminAction(
            req.admin.id,
            ComponentType.CONTENT_ACCESS,
            ActionType.ADD_CONTENT_TYPE,
            { contentId: newContent.id, contentName: newContent.content_name },
            req.ip
        );

        res.status(201).json(newContent);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
