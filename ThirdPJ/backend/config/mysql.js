const mysql = require('mysql2/promise');
const gameDbConfigs = require('./gameDbs.json');

// Connection pool for the operation database (e.g., for admin accounts, coupons)
const operationPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Map to store game database pools by ID
const gamePools = new Map();

// Initialize game database pools
gameDbConfigs.forEach(config => {
    gamePools.set(config.id, mysql.createPool({
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    }));
});

async function queryOperationDb(sql, params) {
    const [rows] = await operationPool.execute(sql, params);
    return rows;
}

function getGameDbQuery(dbId) {
    const pool = gamePools.get(dbId);
    if (!pool) {
        throw new Error(`Game database with ID ${dbId} not found.`);
    }
    return async (sql, params) => {
        const [rows] = await pool.execute(sql, params);
        return rows;
    };
}

module.exports = {
    operationDb: { query: queryOperationDb },
    gameDb: { getQuery: getGameDbQuery }, // Changed to getQuery
    getAvailableGameDbIds: () => gameDbConfigs.map(config => config.id)
};