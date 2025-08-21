const config = require('../../config');
const logger = require('../libs/logger')(config.log.dir,config.log.name,config.log.level);

const sql = require('../models/mysql-db');
const tcp = require('../models/tcp');

const { insertCrmLog } = require('../libs/logHelper'); // 공용 로그 함수 import


module.exports = function(app) {
    app.route('/api/user_chat_block').get(select).post(update); 
}

var select =  function(req,res) {
    logger.debug('get request path:' + req.path + ' (query:' + Object.keys(req.query) + ' values:' + Object.values(req.query) + ')');

    if(typeof req.query.userIdx === 'undefined' || req.query.userIdx.length < 0) 
        return logger.error('request query error');

    
    let worldIdx = req.query.worldIdx;
    let userIdx = req.query.userIdx;
    
    let query = 'select * from user_chat_punish where user_idx='  + userIdx + ' and timestampdiff(SECOND,now(),punish_finish_time) >= 0';
    sql.execute_gamedb(worldIdx,query).then(result => {
        res.json({result:result}); 
    }).catch(err =>{
        res.json({message:err});
    });
}

// command : USER_CHAT_BLOCK , USER_CHAT_UNBLOCK
var update = function(req,res) {
    logger.debug('post request path:' + req.path + ' (body:' + Object.keys(req.body)  + ' values:' + Object.values(req.body) + ')');

    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    if( req.body.length < 0 ||
        typeof req.body.command === 'undefined' || typeof req.body.worldIdx === 'undefined'  || typeof req.body.userIdx === 'undefined' ) {
        res.json({result:'request error'});
        return logger.error('request body error');
    }
    
    let command = req.body.command;
    
    if(command === 'USER_CHAT_BLOCK'){
        let message = command + ' => { worldIdx : ' + req.body.worldIdx + ', userIdx : ' +  req.body.userIdx + ', blockMins : ' +  req.body.blockMins + ', blockReson : ' +  req.body.blockReason + '}';  
        tcp.userChatBlock(req.body.worldIdx,req.body.userIdx,req.body.blockMins,function(response){
            // c9soft-sp_log변경
            // let query = 'insert into tbl_log(ukey,idx,type,message) select ukey, ifnull(max(idx),-1)+1, 2, \''+message+'\' FROM tbl_log where ukey='+req.body.ukey+';';
            // sql.execute_crmdb(query).then(result => {
            //     res.json({result:response});
            // }).catch(err =>{
            //     logger.error('manager process error : ' + err.message );
            //     res.json({result:err});
            // });
            insertCrmLog(req.body.ukey, clientIp, 2, command, message).then((result) => {
                res.json({result:response});
            }).catch(err => {
                logger.error(`manager process error : ${err.message}`);
                res.json({ result: err });
            });
        });
    }
    else if(command === 'USER_CHAT_UNBLOCK') {
        let message = command + ' => { worldIdx : ' + req.body.worldIdx + ', userIdx : ' +  req.body.userIdx + '}';  
        tcp.releaseUserChatBlock(req.body.worldIdx,req.body.userIdx,function(response){
            // c9soft-sp_log변경
            // let query = 'insert into tbl_log(ukey,idx,type,message) select ukey, ifnull(max(idx),-1)+1, 2, \''+message+'\' FROM tbl_log where ukey='+req.body.ukey+';';
            // sql.execute_crmdb(query).then(result => {
            //     res.json({result:response});
            // }).catch(err =>{
            //     logger.error('manager process error : ' + err.message );
            //     res.json({result:err});
            // });
            insertCrmLog(req.body.ukey, clientIp, 2, command, message).then((result) => {
                res.json({result:response});
            }).catch(err => {
                logger.error(`manager process error : ${err.message}`);
                res.json({ result: err });
            });
        });
    }
}