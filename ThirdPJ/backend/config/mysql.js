const mysql = require('mysql2/promise');

// Connection pool for the operation database (game_operation_db)
const operationPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME, // This should be game_operation_db
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Connection pool for the global database (w_globaldb)
const globalPool = mysql.createPool({
    host: process.env.GLOBAL_DB_HOST,
    user: process.env.GLOBAL_DB_USER,
    password: process.env.GLOBAL_DB_PASSWORD,
    database: process.env.GLOBAL_DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Connection pool for the w_setdb
const setdbPool = mysql.createPool({
    host: process.env.SETDB_HOST,
    user: process.env.SETDB_USER,
    password: process.env.SETDB_PASSWORD,
    database: process.env.SETDB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Connection pool for the w_iapdb
const iapPool = mysql.createPool({
    host: process.env.IAP_DB_HOST,
    user: process.env.IAP_DB_USER,
    password: process.env.IAP_DB_PASSWORD,
    database: process.env.IAP_DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Function to reset the connection pool
async function resetSetDbPool() {
    console.log('[DEBUG] Resetting SetDB connection pool...');
    await setdbPool.end();
    // Re-create the pool
    Object.assign(setdbPool, mysql.createPool({
        host: process.env.SETDB_HOST,
        user: process.env.SETDB_USER,
        password: process.env.SETDB_PASSWORD,
        database: process.env.SETDB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    }));
    console.log('[DEBUG] SetDB connection pool has been reset.');
}

// Map to store game database pools by ID
const gamePools = new Map();

// Function to load game database configurations from w_setdb
async function loadGameDbPools() {
    try {
        console.log('[DEBUG] Loading game database configurations from w_setdb...');
        // Query setting_global_dbs for game DBs (fld_type = 2)
        const [globalGameDbs] = await setdbPool.query( // Use setdbPool here
            `SELECT fld_name, fld_address, fld_port, fld_uid, fld_pwd, fld_database 
             FROM setting_global_dbs 
             WHERE fld_type = 2 AND fld_use = 1`
        );

        // Query setting_world_dbs for game DBs (fld_type = 2)
        const [worldGameDbs] = await setdbPool.query( // Use setdbPool here
            `SELECT fld_world_idx, fld_name, fld_address, fld_port, fld_uid, fld_pwd, fld_database 
             FROM setting_world_dbs 
             WHERE fld_type = 2 AND fld_use = 1`
        );

        const allGameDbConfigs = [...globalGameDbs, ...worldGameDbs];

        gamePools.clear(); // Clear existing pools before re-initializing

        allGameDbConfigs.forEach(config => {
            const dbId = config.fld_world_idx ? `w${String(config.fld_world_idx).padStart(2, '0')}_gamedb` : config.fld_name; // Construct ID
            
            // Ensure unique IDs, prefer world_idx based IDs if available
            if (gamePools.has(dbId)) {
                console.warn(`[WARN] Duplicate game DB ID found: ${dbId}. Skipping.`);
                return;
            }

            gamePools.set(dbId, mysql.createPool({
                host: config.fld_address,
                user: config.fld_uid,
                password: config.fld_pwd,
                database: config.fld_database,
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0
            }));
            console.log(`[DEBUG] Added game DB pool: ${dbId}`);
        });
        console.log(`[DEBUG] Loaded ${gamePools.size} game database configurations.`);
    } catch (error) {
        console.error('Error loading game database configurations from w_setdb:', error);
        throw error;
    }
}

async function queryOperationDb(sql, params) {
    console.log('[DEBUG] Executing OperationDB Query:', { sql, params }); // DEBUG LOG
    const rawResult = await operationPool.query(sql, params);
    const [rows] = rawResult;
    return rows;
}

async function queryGlobalDb(sql, params) {
    console.log('[DEBUG] Executing GlobalDB Query:', { sql, params }); // DEBUG LOG
    const [rows] = await globalPool.execute(sql, params);
    return rows;
}

// Add a query function for setdbPool
async function querySetDb(sql, params) {
    console.log('[DEBUG] Executing SetDB Query:', { sql, params }); // DEBUG LOG
    const [rows] = await setdbPool.query(sql, params);
    return rows;
}

function getGameDbQuery(dbId) {
    const pool = gamePools.get(dbId);
    if (!pool) {
        throw new Error(`Game database with ID ${dbId} not found. Available IDs: ${Array.from(gamePools.keys()).join(', ')}`);
    }
    return async (sql, params) => {
        console.log(`[DEBUG] Executing GameDB Query on ${dbId}:`, { sql, params }); // DEBUG LOG
        const [rows] = await pool.execute(sql, params);
        return rows;
    };
}

async function queryIapDb(sql, params) {
    console.log('[DEBUG] Executing IAP_DB Query:', { sql, params }); // DEBUG LOG
    const [rows] = await iapPool.execute(sql, params);
    return rows;
}

module.exports = {
    operationDb: { query: queryOperationDb },
    globalDb: { query: queryGlobalDb }, // Export globalDb
    setdb: { query: querySetDb }, // Export setdb query function
    iapDb: { query: queryIapDb }, // Export iapDb
    resetSetDbPool, // Export the reset function
    gameDb: { getQuery: getGameDbQuery },
    getAvailableGameDbIds: () => Array.from(gamePools.keys()), // Dynamically get IDs
    initialize: loadGameDbPools // Export initialize function
};