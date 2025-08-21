const config = require('../../config');
const logger = require('../libs/logger')(config.log.dir,config.log.name,config.log.level)

const sql = require('./mysql-db');
const MongoClient = require('mongodb').MongoClient;

module.exports.getCollections = function(world, yyyymm){
    return new Promise((resolve, reject) => {
        sql.getMongodbs().then(dbInfos => {
            //logger.debug(`mongo db infos : ${JSON.stringify(dbInfos)}`);
            let host = '', port = 0;
            for(let i=0; i<dbInfos.length; i++){
                if(dbInfos[i].worldIdx === Number(world)){
                    host = dbInfos[i].host;
                    port = dbInfos[i].port;
                    break;
                }
            }
            logger.debug(`mongo info world : ${world}, host : ${host}, port : ${port}`);
            //host = '125.131.20.179';
            //port = 60002;

            let connectionString = `mongodb://${host}:${port}`;
            logger.debug(`mongo connectiong : ${connectionString}`);

            let dbName = `Log_${yyyymm}`;
            logger.debug(`mongo db name : ${dbName}`);

            MongoClient.connect(connectionString, function (err, client) {
                if (err) {
                    logger.error(`mongo db connect fail : ${err}`);
                    reject(err);
                }
                let db = client.db(dbName);
                db.listCollections().toArray(function (err, collections) {
                    if (err) {
                        reject(err);
                        logger.error(`mongo db get collections err : ${err}`);
                    } else {
                        resolve(collections);
                        //logger.debug('mongo db collections : ' + JSON.stringify(collections));
                    } 
                });
                client.close();
            }); 
        }).catch(err =>{
            reject(err);
            logger.error(`get mongo db info err : ${err}`);
        });  
    }); 
}

module.exports.findDocument = function(world, yyyymm, collecionName,startDate,endDate,page,nid) {
    return new Promise((resolve, reject) => {
        sql.getMongodbs().then(dbInfos => {
            //logger.debug(`mongo db infos : ${JSON.stringify(dbInfos)}`);
            let host = '', port = 0;
            for(let i=0; i<dbInfos.length; i++){
                if(dbInfos[i].worldIdx === Number(world)){
                    host = dbInfos[i].host;
                    port = dbInfos[i].port;
                    break;
                }
            }
            logger.debug(`mongo info world : ${world}, host : ${host}, port : ${port}`);
            //host = '125.131.20.179';
            //port = 60002;

            let connectionString = `mongodb://${host}:${port}`;
            logger.debug(`mongo connectiong : ${connectionString}`);

            let dbName = `Log_${yyyymm}`;
            logger.debug(`mongo db name : ${dbName}`);

            MongoClient.connect(connectionString, function (err, client) {
                if (err) {
                    logger.error(`mongo db connect fail : ${err}`);
                    reject(err);
                }
                let db = client.db(dbName);
                let collection = db.collection(collecionName);
                let strStartDate    = YYYYMMddHHmmssToTimeString(startDate);
                let strEndDate      = YYYYMMddHHmmssToTimeString(endDate);
                
                logger.debug(`searching mongo collection : ${collecionName} start : ${strStartDate} end : ${strEndDate} page : ${page} nid : ${nid}`);                
                let query = nid === '' ? {"server":Number(world), "_time":{$gte:strStartDate, $lte:strEndDate}} : {"server":Number(world), "_time":{$gte:strStartDate, $lte:strEndDate}, "nid":nid};

                collection.find(query,{projection: {_id: 0, _i_t:0}})
                .skip((page-1)*1000)
                .limit(1000)
                .toArray(function(err, docs) {
                    if (err) {
                        logger.error(`mongo db collection find fail : ${err}`);
                        reject(err);
                    }
                    else {
                        //logger.debug(`mongo db find documnet : ${JSON.stringify(docs)}`);
                        resolve(docs);
                    } 
                    client.close();
                });
            }); 
        }).catch(err =>{
            logger.error(`get mongo db info err : ${err} `);
            reject(err);
        });  
    });    
}

function YYYYMMddHHmmssToTimeString(dateStr) {
    var year = dateStr.substring(0, 4);
    var month = dateStr.substring(4, 6);
    var day = dateStr.substring(6, 8);
    var hour = dateStr.substring(8, 10);
    var minute = dateStr.substring(10, 12);
    var second = dateStr.substring(12, 14);
    
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

/*
module.exports.findDocument = function(world, yyyymm, collecionName,startDate,endDate,page,nick) {
    return new Promise((resolve, reject) => {
        sql.getMongodbs().then(dbInfos => {
            //logger.debug(`mongo db infos : ${JSON.stringify(dbInfos)}`);
            let host = '', port = 0;
            for(let i=0; i<dbInfos.length; i++){
                if(dbInfos[i].worldIdx === Number(world)){
                    host = dbInfos[i].host;
                    port = dbInfos[i].port;
                    break;
                }
            }
            logger.debug(`mongo info world : ${world}, host : ${host}, port : ${port}`);
            //host = '125.131.20.179';
            //port = 60002;

            let connectionString = `mongodb://${host}:${port}`;
            logger.debug(`mongo connectiong : ${connectionString}`);

            let dbName = `Log_${yyyymm}`;
            logger.debug(`mongo db name : ${dbName}`);

            MongoClient.connect(connectionString, function (err, client) {
                if (err) {
                    logger.error(`mongo db connect fail : ${err}`);
                    reject(err);
                }
                let db = client.db(dbName);
                let collection = db.collection(collecionName);
                let start = YYYYMMddHHmmssToDate(startDate).getTime();
                let end = YYYYMMddHHmmssToDate(endDate).getTime();
                
                logger.debug(`searching mongo collection : ${collecionName} start : ${start} end : ${end} page : ${page} nick : ${nick}`);
                
                let query = nick === '' ? {"server":Number(world), "_i_t":{$gte:start, $lte:end}} : {"server":Number(world), "_i_t":{$gte:start, $lte:end}, "nick":nick};
                collection.find(query,{projection: {_id: 0, _i_t:0}})
                .skip((page-1)*1000)
                .limit(1000)
                .toArray(function(err, docs) {
                    if (err) {
                        logger.error(`mongo db collection find fail : ${err}`);
                        reject(err);
                    }
                    else {
                        logger.debug(`mongo db find documnet : ${JSON.stringify(docs)}`);
                        resolve(docs);
                    } 
                    client.close();
                });
            }); 
        }).catch(err =>{
            logger.error(`get mongo db info err : ${err} `);
            reject(err);
        });  
    });    
}
*/

function YYYYMMddHHmmssToDate(dateStr) {
    var year = dateStr.substring(0, 4);
    var month = dateStr.substring(4, 6);
    var day = dateStr.substring(6, 8);
    var hour = dateStr.substring(8, 10);
    var minute = dateStr.substring(10, 12);
    var second = dateStr.substring(12, 14);
    
    return new Date(year, month-1, day, hour, minute, second);
}