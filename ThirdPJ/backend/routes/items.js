const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { gameDb } = require('../config/mysql');
const { logAdminAction, ComponentType, ActionType } = require('../utils/adminLogger');
const { loadItemData, getItemData } = require('../utils/itemDataParser');

// Removed loadItemData() call from here

/**
 * @route   POST /api/items/give
 * @desc    Give item to a player by inserting into user_post table
 * @access  Private
 */
router.post('/give', auth, async (req, res) => {
    const { userIndex, charIndex, dbId, itemId, quantity } = req.body;

    if (userIndex === undefined || charIndex === undefined || dbId === undefined || itemId === undefined || quantity === undefined) {
        return res.status(400).json({ msg: 'userIndex, charIndex, dbId, itemId, and quantity are required.' });
    }

    try {
        const queryGameDb = gameDb.getQuery(dbId);
        const itemDetails = getItemData().get(String(itemId));

        if (!itemDetails) {
            return res.status(404).json({ msg: 'Item not found.' });
        }

        // --- Start of Defensive Coding --- 
        // Ensure all parameters are defined and have default values if necessary.
        const p_user_idx = userIndex;
        const p_send_idx = 0; // 0 for AdminTool
        const p_sender_nick = 'AdminTool';
        const p_char_idx = charIndex;
        const p_post_type = 1; // 1 for item delivery
        const p_post_text_idx = 0;
        const p_title_msg = '아이템 지급';
        const p_message = `아이템 ${itemDetails.name || 'Unknown Item'} ${quantity}개가 지급되었습니다.`;
        
        const expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 7);
        const p_expire_date = expireDate;

        // CRITICAL: Ensure item_type is not undefined. Default to a safe value if needed.
        const p_item_type = itemDetails.category ?? 'etc'; // Default to 'etc' if category is undefined
        const p_item_id = itemId;
        const p_item_value = quantity;
        // --- End of Defensive Coding ---

        const sql = `
            INSERT INTO user_post (
                user_idx, send_idx, sender_nick, char_idx,
                post_type, post_text_idx, title_msg, message, expire_date,
                item_type, item_id, item_value
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const params = [
            p_user_idx, p_send_idx, p_sender_nick, p_char_idx,
            p_post_type, p_post_text_idx, p_title_msg, p_message, p_expire_date,
            p_item_type, p_item_id, p_item_value
        ];

        await queryGameDb(sql, params);

        // Log the item giving action
        logAdminAction(
            req.admin.id,
            ComponentType.PLAYER_MANAGEMENT, // Assuming item giving is part of player management
            ActionType.GIVE_ITEM, // Need to add GIVE_ITEM to ActionType enum
            { userIndex, charIndex, dbId, itemId, quantity, itemName: itemDetails.name },
            req.ip
        );

        res.json({ msg: `Successfully sent ${quantity} of item ${itemDetails.name} to player ${userIndex} via user_post.` });
    } catch (err) {
        console.error('Error in /api/items/give:', err.message);
        res.status(500).send('Server Error');
    }
});

// Removed the /take route as requested

/**
 * @route   GET /api/items/lookup/:itemId
 * @desc    Lookup item details by ID
 * @access  Private
 */
router.get('/lookup/:itemId', auth, (req, res) => {
    const { itemId } = req.params;

    const item = getItemData().get(String(itemId));

    if (!item) {
        return res.status(404).json({ msg: 'Item not found.' });
    }

    res.json(item);
});

/**
 * @route   GET /api/items/all
 * @desc    Get all item id and name_kor
 * @access  Private
 */
router.get('/all', auth, (req, res) => {
    try {
        const allItems = getItemData();
        const itemList = Array.from(allItems.values()).map(item => ({
            id: item.id,
            name_kor: item.name_kor
        }));
        res.json(itemList);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
