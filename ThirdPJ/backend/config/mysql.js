const mysql = require('mysql2/promise');

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

// Connection pool for the game database (e.g., for userinfo, char_info)
const gamePool = mysql.createPool({
    host: process.env.GAME_DB_HOST,
    user: process.env.GAME_DB_USER,
    password: process.env.GAME_DB_PASSWORD,
    database: process.env.GAME_DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function queryOperationDb(sql, params) {
    const [rows] = await operationPool.execute(sql, params);
    return rows;
}

async function queryGameDb(sql, params) {
    const [rows] = await gamePool.execute(sql, params);
    return rows;
}

module.exports = {
    operationDb: { query: queryOperationDb },
    gameDb: { query: queryGameDb }
};
