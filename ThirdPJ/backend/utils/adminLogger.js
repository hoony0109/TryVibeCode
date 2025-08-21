const { operationDb } = require('../config/mysql');

/**
 * Enum for component types.
 * @readonly
 * @enum {number}
 */
const ComponentType = {
    UNKNOWN: 0,
    AUTH: 1,
    NOTICE: 2,
    COUPON: 3,
    PLAYER_MANAGEMENT: 4,
    SERVER_SETTINGS: 5,
    ADMIN_CREATION: 6,
    CONTENT_ACCESS: 7,
    IP_BLOCK: 8,
};

/**
 * Enum for action types.
 * @readonly
 * @enum {string}
 */
const ActionType = {
    // Auth
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGOUT: 'LOGOUT',

    // Admin Creation
    CREATE_ADMIN: 'CREATE_ADMIN',

    // Notices
    CREATE_NOTICE: 'CREATE_NOTICE',
    UPDATE_NOTICE: 'UPDATE_NOTICE',
    DELETE_NOTICE: 'DELETE_NOTICE',

    // Coupons
    CREATE_COUPON_EVENT: 'CREATE_COUPON_EVENT',

    // Player Management
    UPDATE_PLAYER_STATUS: 'UPDATE_PLAYER_STATUS',
    GIVE_ITEM: 'GIVE_ITEM',

    // Server Settings
    UPDATE_MAINTENANCE: 'UPDATE_MAINTENANCE',

    // IP Block
    ADD_IP_BLOCK: 'ADD_IP_BLOCK',
    REMOVE_IP_BLOCK: 'REMOVE_IP_BLOCK',

    // Content Access
    UPDATE_CONTENT_ACCESS: 'UPDATE_CONTENT_ACCESS',
    ADD_CONTENT_TYPE: 'ADD_CONTENT_TYPE',
};

/**
 * Logs an admin action to the database.
 * This function is designed to be fire-and-forget. It will not throw errors
 * to prevent logging failures from breaking main application logic.
 *
 * @param {number} adminId - The ID of the admin performing the action.
 * @param {ComponentType} componentType - The type of component being affected.
 * @param {string} actionType - A string describing the action (e.g., 'CREATE_ADMIN').
 * @param {object} [targetData={}] - A JSON object containing relevant data about the action.
 * @param {string} [ipAddress=''] - The IP address of the user performing the action.
 */
async function logAdminAction(adminId, componentType, actionType, targetData = {}, ipAddress = '') {
    if (!adminId) {
        console.error('Failed to write admin log: adminId is missing.');
        return;
    }

    try {
        // 1. Get the next index for the specific admin.
        const [lastLog] = await operationDb.query(
            'SELECT MAX(idx) as max_idx FROM admin_logs WHERE admin_id = ?',
            [adminId]
        );
        const nextIdx = (lastLog?.max_idx || 0) + 1;

        // 2. Insert the new log record.
        const sql = `
            INSERT INTO admin_logs 
                (admin_id, idx, component_type, action_type, target_data, ip_address) 
            VALUES 
                (?, ?, ?, ?, ?, ?)
        `;
        const params = [
            adminId,
            nextIdx,
            componentType,
            actionType,
            JSON.stringify(targetData),
            ipAddress
        ];

        await operationDb.query(sql, params);

    } catch (error) {
        console.error('Failed to write admin log:', error);
        // We don't re-throw the error because logging should not interrupt the main operation.
    }
}

module.exports = {
    logAdminAction,
    ComponentType,
    ActionType,
};
