const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { gameDb } = require('../config/mysql');

/**
 * @route   POST /api/items/give
 * @desc    Give item to a player
 * @access  Private
 */
router.post('/give', auth, async (req, res) => {
    const { userIndex, charIndex, dbId, itemId, itemType, quantity } = req.body;

    if (!userIndex || !charIndex || !dbId || !itemId || !itemType || quantity === undefined) {
        return res.status(400).json({ msg: 'Missing required fields.' });
    }

    try {
        const queryGameDb = gameDb.getQuery(dbId);

        if (itemType === 'consumable') {
            // For consumable items, update item_value in char_inven_item
            const sql = `
                INSERT INTO char_inven_item (char_idx, user_idx, item_type, item_id, item_value)
                VALUES (?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE item_value = item_value + VALUES(item_value)
            `;
            await queryGameDb(sql, [charIndex, userIndex, 1, itemId, quantity]); // item_type 1 for consumable
        } else if (itemType === 'equipment') {
            // For equipment, insert a new row in char_inven_equip
            // This is a simplified example. Real equipment might need more fields (quality, level, etc.)
            const sql = `
                INSERT INTO char_inven_equip (char_idx, user_idx, item_id, quality_grade, item_level, equip_type, item_exp, equip, equip_slot, belong, remove_lock, enchant_level, identify)
                VALUES (?, ?, ?, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0)
            `;
            // Assuming default values for other fields for simplicity
            await queryGameDb(sql, [charIndex, userIndex, itemId]);
        } else {
            return res.status(400).json({ msg: 'Invalid item type.' });
        }

        res.json({ msg: `Successfully gave ${quantity} of item ${itemId} to player ${userIndex}.` });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

/**
 * @route   POST /api/items/take
 * @desc    Take item from a player
 * @access  Private
 */
router.post('/take', auth, async (req, res) => {
    const { userIndex, charIndex, dbId, itemId, itemType, quantity } = req.body;

    if (!userIndex || !charIndex || !dbId || !itemId || !itemType || quantity === undefined) {
        return res.status(400).json({ msg: 'Missing required fields.' });
    }

    try {
        const queryGameDb = gameDb.getQuery(dbId);

        if (itemType === 'consumable') {
            // For consumable items, decrease item_value in char_inven_item
            // Ensure quantity does not go below zero
            const checkSql = `SELECT item_value FROM char_inven_item WHERE char_idx = ? AND user_idx = ? AND item_id = ?`;
            const currentItem = await queryGameDb(checkSql, [charIndex, userIndex, itemId]);

            if (currentItem.length === 0 || currentItem[0].item_value < quantity) {
                return res.status(400).json({ msg: 'Player does not have enough of this item.' });
            }

            const sql = `
                UPDATE char_inven_item
                SET item_value = item_value - ?
                WHERE char_idx = ? AND user_idx = ? AND item_id = ?
            `;
            await queryGameDb(sql, [quantity, charIndex, userIndex, itemId]);
        } else if (itemType === 'equipment') {
            // For equipment, delete a specific item_idx or the first one found
            // This is a simplified example. Real equipment might need item_idx to be specified.
            const sql = `
                DELETE FROM char_inven_equip
                WHERE char_idx = ? AND user_idx = ? AND item_id = ?
                LIMIT 1 -- Delete only one instance
            `;
            await queryGameDb(sql, [charIndex, userIndex, itemId]);
        } else {
            return res.status(400).json({ msg: 'Invalid item type.' });
        }

        res.json({ msg: `Successfully took ${quantity} of item ${itemId} from player ${userIndex}.` });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

/**
 * @route   GET /api/items/lookup/:itemId
 * @desc    Lookup item details by ID
 * @access  Private
 */
router.get('/lookup/:itemId', auth, (req, res) => {
    const { itemId } = req.params;

    // Mock item data - In a real application, this would come from a game item master data DB
    const mockItemData = {
        1001: { name: 'Health Potion', type: 'consumable', description: 'Restores HP.' },
        1002: { name: 'Mana Potion', type: 'consumable', description: 'Restores MP.' },
        2001: { name: 'Warrior Sword', type: 'equipment', description: 'A basic sword for warriors.' },
        2002: { name: 'Mage Staff', type: 'equipment', description: 'A basic staff for mages.' },
    };

    const item = mockItemData[itemId];

    if (!item) {
        return res.status(404).json({ msg: 'Item not found.' });
    }

    res.json(item);
});
