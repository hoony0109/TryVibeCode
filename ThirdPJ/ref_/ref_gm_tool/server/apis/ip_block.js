const config = require('../../config');
const logger = require('../libs/logger')(config.log.dir,config.log.name,config.log.level);
const dataManager = require('../libs/dataManager');

const sql = require('../models/mysql-db');
const tcp = require('../models/tcp');

const { insertCrmLog } = require('../libs/logHelper'); // 공용 로그 함수 import


module.exports = function(app) {
    app.route('/api/ip_block').get(select).post(update); 
}

var select =  function(req,res) {
    logger.debug('get request path:' + req.path + ' (query:' + Object.keys(req.query) + ' values:' + Object.values(req.query) + ')');
    
    let query = ' select * from w_globaldb.ip_block where timestampdiff(SECOND,now(),block_finish_time) >= 0;';
    sql.execute_globaldb(query).then(result => {
        res.json({result:result});
    }).catch(err =>{
        res.json({message:err});
    });
}

var update = function(req,res) {
    logger.debug('post request path:' + req.path + ' (body:' + Object.keys(req.body)  + ' values:' + Object.values(req.body) + ')');

    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    if(typeof req.body.command === 'undefined' || typeof req.body.ip === 'undefined' || typeof req.body.blockHours === 'undefined'){
        res.json({result:'request error'});
        return logger.error('request body error');
    }

    let command = req.body.command;

    if(command === 'IP_BLOCK') {
        let message = command + ' => { ip : ' + req.body.ip + ', blockHours : ' +  req.body.blockHours + ', blockReson : ' +  req.body.blockReason + '}';  
        tcp.ipBlock(req.body.ip,req.body.blockHours,function(response){
            // c9soft-sp_log변경
            // let query = 'insert into tbl_log(ukey,idx,type,message) select ukey, ifnull(max(idx),-1)+1, 4, \''+message+'\' FROM tbl_log where ukey='+req.body.ukey+';';
            // sql.execute_crmdb(query).then(result => {
            //     res.json({result:response});
            // }).catch(err =>{
            //     logger.error('manager process error : ' + err.message );
            //     res.json({result:err});
            // });
            insertCrmLog(req.body.ukey, clientIp, 4, command, message).then(() => {
                res.json({ result:response }); 
            }).catch(err => {
                logger.error(`manager process error : ${err.message}`);
                res.json({ result: err });
            });            
        });
    }
    else if(command === 'IP_UNBLOCK') {
        let message = command + ' => { ip : ' + req.body.ip + '}';  
        tcp.releaseIpBlock(req.body.ip,function(response){
            // c9soft-sp_log변경
            // let query = 'insert into tbl_log(ukey,idx,type,message) select ukey, ifnull(max(idx),-1)+1, 4, \''+message+'\' FROM tbl_log where ukey='+req.body.ukey+';';
            // sql.execute_crmdb(query).then(result => {
            //     res.json({result:response});
            // }).catch(err =>{
            //     logger.error('manager process error : ' + err.message );
            //     res.json({result:err});
            // });
            insertCrmLog(req.body.ukey, clientIp, 4, command, message).then(() => {
                res.json({ result:response }); 
            }).catch(err => {
                logger.error(`manager process error : ${err.message}`);
                res.json({ result: err });
            });             
        });
    }   
}