const config = require('../../config');
const logger = require('../libs/logger')(config.log.dir,config.log.name,config.log.level);

const mysql = require('mysql');
const { isAccessor } = require('typescript');

const crmdb = mysql.createPool({
    connectionLimit     : config.mysql.crm.poolSize,
    host                : config.mysql.crm.ip,
    port                : config.mysql.crm.port,
    user                : config.mysql.crm.user,
    password            : config.mysql.crm.pwd,
    database            : config.mysql.crm.db,
    multipleStatements  : true
});

const globaldb = mysql.createPool({
    connectionLimit     : config.mysql.global.poolSize,
    host                : config.mysql.global.ip,
    port                : config.mysql.global.port,
    user                : config.mysql.global.user,
    password            : config.mysql.global.pwd,
    database            : config.mysql.global.db,
    multipleStatements  : true
});

const w_setdb = mysql.createPool({
    connectionLimit     : config.mysql.w_set.poolSize,
    host                : config.mysql.w_set.ip,
    port                : config.mysql.w_set.port,
    user                : config.mysql.w_set.user,
    password            : config.mysql.w_set.pwd,
    database            : config.mysql.w_set.db,
    multipleStatements  : true
});

const iapdb = mysql.createPool({
    connectionLimit     : config.mysql.iap.poolSize,
    host                : config.mysql.iap.ip,
    port                : config.mysql.iap.port,
    user                : config.mysql.iap.user,
    password            : config.mysql.iap.pwd,
    database            : config.mysql.iap.db,
    multipleStatements  : true
});

var gamedbInfos = [];
var gamedbs = [];

// DB연결을 한다
getGamedbs();



/*
데이터가 가져와지긴 하는데 아래처럼 RowDataPacket 형태로 저장된다.

[ RowDataPacket { title: 'Amazon' },
  RowDataPacket { title: 'Apple' } ]

OkPacket {
  fieldCount: 0,
  affectedRows: 1,
  insertId: 4,         // 인덱스 4로 들어간 것
  serverStatus: 2,
  warningCount: 0,
  message: '',
  protocol41: true,
  changedRows: 0 }
*/




/*
// w_setdb에서 gamedb 정보 읽어서 연결하기
*/
function getGamedbs() {
    return new Promise((resolve, reject) => {
        w_setdb.getConnection(function(err,connection){
            if (err) {
                logger.error(`w_setdb query(${err.sql}) execute error : ${err.message}`);
                return reject(err);
            }  
            
            let query = 'select * from w_setdb.setting_world_dbs where fld_type=2 and fld_use = 1;';       
            connection.query(query,function (err, result, fields) {
                connection.release();            
                if (err) {
                    logger.error(`w_setdb query(${err.sql}) execute error : ${err.message}`);
                    reject(err);
                } else {
                    for(let i=0; i<result.length; i++){
                        if(result[i].constructor.name === 'OkPacket'){
                            result.splice(i,1);
                        }
                    }

                    if(gamedbInfos.length === result.length && gamedbs.length === result.length){
                        let isSame = true;
                        for(let i=0; i<result.length;i++){
                            if( gamedbInfos[i].idx !== i ||
                                gamedbInfos[i].worldIdx !== result[i].fld_world_idx ||
                                gamedbInfos[i].host !== result[i].fld_address_pub ||
                                gamedbInfos[i].port !== result[i].fld_port ||
                                gamedbInfos[i].user !== result[i].fld_uid ||
                                gamedbInfos[i].password !== result[i].fld_pwd ||
                                gamedbInfos[i].database !== result[i].fld_database ){
                                isSame = false;
                                break;
                            }
                        }
                        
                        if(isSame){
                            return resolve({gamedbInfos,gamedbs});
                        }
                    }

                    let dbInfos = [];
                    let dbs = [];
                    for(let i=0; i<result.length;i++){
                        dbInfos.push({
                            idx : i,
                            worldIdx : result[i].fld_world_idx,
                            host : result[i].fld_address_pub,
                            port : result[i].fld_port,
                            user : result[i].fld_uid,
                            password : result[i].fld_pwd,
                            database : result[i].fld_database
                        });

                        dbs.push(
                            mysql.createPool({
                                connectionLimit     : config.mysql.game.poolSize,
                                host                : result[i].fld_address_pub,
                                port                : result[i].fld_port,
                                user                : result[i].fld_uid,
                                password            : result[i].fld_pwd,
                                database            : result[i].fld_database,
                                multipleStatements  : true
                            })
                        );
                    } 
                    gamedbInfos = dbInfos;
                    gamedbs = dbs;
                    
                    logger.debug(`create game db pools : ${JSON.stringify(gamedbInfos)}`);
                    resolve({gamedbInfos,gamedbs});
                }
            });
        });
    });
}

module.exports.getMongodbs = function() {
    return new Promise((resolve, reject) => {
        w_setdb.getConnection(function(err,connection){
            if (err) {
                logger.error(`w_setdb query(${err.sql}) execute error :${err.message}`);
                return reject(err);
            }  
            
            let query = 'select * from w_setdb.setting_global_gamelog_mongodb where usable=1 and world_id>0;';       
            connection.query(query,function (err, result, fields) {
                connection.release();            
                if (err) {
                    logger.error(`w_setdb query(${err.sql}) execute error : ${err.message}`);
                    reject(err);
                } else {
                    for(let i=0; i<result.length; i++){
                        if(result[i].constructor.name === 'OkPacket'){
                            result.splice(i,1);
                        }
                    }

                    let dbInfos = [];
                    for(let i=0; i<result.length;i++){
                        dbInfos.push({
                            worldIdx : result[i].world_id,
                            name : result[i].desc,
                            host : result[i].address_mongodb_ip,
                            port : result[i].port_mongodb
                        });
                    } 
                    
                    logger.debug(`get mongo db info : ${JSON.stringify(dbInfos)}`);
                    resolve(dbInfos);
                }
            });
        });
    });
}

module.exports.execute_crmdb = function(query,values) {
    return new Promise((resolve, reject) => {
       logger.debug(`crmdb execute : ${query} values[${values ?? ''}])`);
        crmdb.getConnection(function(err,connection){
            if (err) {
                logger.error(`crmdb query(${err.sql}) execute error :${err.message}`);
                return reject(err);
            }           
            connection.query(query,values,function (err, result, fields) {
                connection.release();            
                if (err) {
                    logger.error(`crmdb query(${err.sql}) execute error :${err.message}`);
                    reject(err);
                } else {
                    for(let i=0; i<result.length; i++){
                        if(result[i].constructor.name === 'OkPacket'){
                            result.splice(i,1);
                        }
                    }
                    resolve(result);
                }
            });
        });
    });
}

module.exports.execute_setdb = function(query,values) {
    return new Promise((resolve, reject) => {
       logger.debug(`w_setdb execute : ${query} values[${values ?? ''}])`);
       w_setdb.getConnection(function(err,connection){
            if (err) {
                logger.error(`w_setdb query(${err.sql}) execute error :${err.message}`);
                return reject(err);
            }           
            connection.query(query,values,function (err, result, fields) {
                connection.release();            
                if (err) {
                    logger.error(`w_setdb query(${err.sql}) execute error :${err.message}`);
                    reject(err);
                } else {
                    for(let i=0; i<result.length; i++){
                        if(result[i].constructor.name === 'OkPacket'){
                            result.splice(i,1);
                        }
                    }
                    resolve(result);
                }
            });
        });
    });
}

module.exports.execute_globaldb = function(query,values) {
    return new Promise((resolve, reject) => {
        logger.debug(`w_globaldb execute : ${query} values[${values ?? ''}])`);
        globaldb.getConnection(function(err,connection){
            if (err) {
                logger.error(`w_globaldb query(${err.sql}) execute error :${err.message}`);
                return reject(err);
            }           
            connection.query(query,values,function (err, result, fields) {
                connection.release();            
                if (err) {
                    logger.error(`w_globaldb query(${err.sql}) execute error : ${err.message}`);
                    reject(err);
                } else {
                    for(let i=0; i<result.length; i++){
                        if(result[i].constructor.name === 'OkPacket'){  // 'OkPacket row 제거'
                            result.splice(i,1);
                        }
                    }
                    resolve(result);
                }
            });
        });
    });
}

module.exports.execute_iapdb = function(query,values) {
    return new Promise((resolve, reject) => {
        logger.debug(`w_iapdb execute : ${query} values[${values ?? ''}])`);
        iapdb.getConnection(function(err,connection){
            if (err) {
                logger.error(`w_iapdb query(${err.sql}) execute error :${err.message}`);
                return reject(err);
            }           
            connection.query(query,values,function (err, result, fields) {
                connection.release();            
                if (err) {
                    logger.error(`w_iapdb query(${err.sql}) execute error : ${err.message}`);
                    reject(err);
                } else {
                    for(let i=0; i<result.length; i++){
                        if(result[i].constructor.name === 'OkPacket'){
                            result.splice(i,1);
                        }
                    }
                    resolve(result);
                }
            });
        });
    });
}

module.exports.execute_gamedb = function(worldIdx,query,values) {
    return new Promise((resolve, reject) => {
        getGamedbs().then(result => { 
            let dbIndex = 0;
            for(let i=0; i<gamedbInfos.length; i++){
                if(Number(worldIdx) === gamedbInfos[i].worldIdx){
                    dbIndex = gamedbInfos[i].idx;
                    break;
                }
            }
            
            logger.debug(`gamedb execute : ${query} values[${values ?? ''}]`);
            gamedbs[dbIndex].getConnection(function(err,connection){
                if (err) {
                    logger.error(`gamedb query(${err.sql}) execute error : ${err.message}`);
                    return reject(err);
                }           
                connection.query(query,values,function (err, result, fields) {
                    connection.release();            
                    if (err) {
                        logger.error(`gamedb query(${err.sql}) execute error : ${err.message}`);
                        reject(err);
                    } else {
                        for(let i=0; i<result.length; i++){
                            if(result[i].constructor.name === 'OkPacket'){
                                result.splice(i,1);
                            }
                        }
                        resolve(result);
                    }
                });
            });
        });
    });
}

module.exports.execute_all_gamedb = function(query,values) {
    return new Promise((resolve, reject) => {  
        getGamedbs().then(result => { 
            let sendDbs = [];
            for(let i=0; i<gamedbInfos.length; i++){
                
                let isDuplicate = false;
                for(let j=0; j<sendDbs.length; j++){
                    if(sendDbs[j].host === gamedbInfos[i].host &&
                    sendDbs[j].port === gamedbInfos[i].port &&
                    sendDbs[j].database === gamedbInfos[i].database){
                        isDuplicate = true;
                        break;
                    }
                }
                if(isDuplicate === false) sendDbs.push(gamedbInfos[i]);
            }

            for(let i=0; i<sendDbs.length; i++){
                logger.debug(`gamedb execute : ${query} values[${values ?? ''}]`);
                gamedbs[sendDbs[i].idx].getConnection(function(err,connection){
                    if (err) {
                        logger.error(`gamedb query(${err.sql}) execute error : ${err.message}`);
                        return reject(err);
                    }           
                    connection.query(query,values,function (err, result, fields) {
                        connection.release();            
                        if (err) {
                            logger.error(`gamedb query(${err.sql}) execute error : ${err.message}`);
                            reject(err);
                        } else {
                            if(i+1 === sendDbs.length){
                                for(let i=0; i<result.length; i++){
                                    if(result[i].constructor.name === 'OkPacket'){
                                        result.splice(i,1);
                                    }
                                }
                                resolve(result);
                            }  
                        }
                    });
                });
            }
        });
    });
}
