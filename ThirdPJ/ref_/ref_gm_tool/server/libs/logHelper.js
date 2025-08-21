// logHelper.js
const sql = require('../models/mysql-db');
const logger = require('../libs/logger');

function insertCrmLog(ukey, clientIp, type, command, message) {
    const query = `CALL csp_insert_log(?, ?, ?, ?, ?);`;
    const params = [ukey, clientIp, type, command, message];
    
    return sql.execute_crmdb(query, params)
        .then(result => {
            const firstResult = result[0] || []; // 첫 번째 결과 집합만 반환
            logger.debug(`Log inserted successfully for ukey: ${ukey}, type: ${type}`);
            return firstResult;
        })
        .catch(err => {
            logger.error(`Error inserting log for ukey: ${ukey} - ${err.message}`);
            throw err;
        });
}

module.exports = { insertCrmLog };
