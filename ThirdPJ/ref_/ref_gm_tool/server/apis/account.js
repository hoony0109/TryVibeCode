const config = require('../../config');
const logger = require('../libs/logger')(config.log.dir,config.log.name,config.log.level);

const sql = require('../models/mysql-db');
const tcp = require('../models/tcp');

const { insertCrmLog } = require('../libs/logHelper'); // 공용 로그 함수 import

// api
// : account
module.exports = function(app) {
    app.route('/api/account').get(select).post(update); 
}

var select =  function(req,res) {
    logger.debug(`get request path:${req.path} (query:${Object.keys(req.query)} values:${Object.values(req.query)} )`);

    if(typeof req.query.accountId !== 'undefined' && req.query.accountId.length > 0){
        let accountId = req.query.accountId;
        let query = `select a.account_id, a.user_id as account_idx, a.account_type, a.account_status, a.block_finish_date as block_date, b.world_idx, b.game_user_idx, b.character_exist, b.last_login_date, b.reg_date from w_globaldb.line_account a join w_globaldb.line_account_world b on a.user_id = b.account_idx where a.account_id =\'${accountId}\';`;
        sql.execute_globaldb(query).then(result => {
            //logger.debug(`select account => ${JSON.stringify(result)}`);
            res.json({result:result});
        }).catch(err =>{
            logger.error(`account process error : ${err.message}`);
            res.json({message:err});
        });
    }

    else if(typeof req.query.gameAccountID !== 'undefined' && req.query.gameAccountID.length > 0){
        let gameAccountID = req.query.gameAccountID;
        let query = `select a.account_id, a.user_id as account_idx, a.account_type, a.account_status, a.block_finish_date as block_date, b.world_idx, b.game_user_idx, b.character_exist, b.last_login_date, b.reg_date from w_globaldb.line_account a join w_globaldb.line_account_world b on a.user_id = b.account_idx where b.account_idx = \'${gameAccountID}\';`;
        sql.execute_globaldb(query).then(result => {
            //logger.debug(`select account => ${JSON.stringify(result)}`);
            res.json({result:result});
        }).catch(err =>{
            logger.error(`account process error : ${err.message}`);
            res.json({message:err});
        });
    }    
     
    else if(typeof req.query.gameUserId !== 'undefined' && req.query.gameUserId.length > 0){
        let gameUserId = req.query.gameUserId;
        let query = `select a.account_id, a.user_id as account_idx, a.account_type, a.account_status, a.block_finish_date as block_date, b.world_idx, b.game_user_idx, b.character_exist, b.last_login_date, b.reg_date from w_globaldb.line_account a join w_globaldb.line_account_world b on a.user_id = b.account_idx where b.game_user_idx =\'${gameUserId}\';`;
        sql.execute_globaldb(query).then(result => {
            //logger.debug(`select account => ${JSON.stringify(result)}`);
            res.json({result:result});
        }).catch(err =>{
            logger.error(`account process error : ${err.message}`);
            res.json({message:err});
        });
    }
    
    else if(typeof req.query.worldIdx !== 'undefined' && typeof req.query.characterNick !== 'undefined'){
        let worldIdx = req.query.worldIdx;
        let nick = req.query.characterNick;
        let query = `select user_idx from userinfo where nick=\'${nick}\';`;
        sql.execute_gamedb(worldIdx,query).then(result => {
            if(result.length > 0){
                let userIdx =  result[0].user_idx;
                query = 'select a.account_id, a.user_id as account_idx, a.account_type, a.account_status, a.block_finish_date as block_date, b.world_idx, b.game_user_idx, b.character_exist, b.last_login_date, b.reg_date from w_globaldb.line_account a join w_globaldb.line_account_world b on a.user_id = b.account_idx where b.game_user_idx =\'' + userIdx + '\';';
                sql.execute_globaldb(query).then(result => {
                    res.json({result:result});
                }).catch(err =>{
                    logger.error(`account process error : ${err.message}`);
                    res.json({message:err});
                });
            }
            else res.json({result:result});
        }).catch(err =>{
            logger.error(`account process error : ${err.message}`);
            res.json({message:err});
        });
    }
    
    else return logger.error('request query error');
}

// command : ACCOUNT_LOGOFF , ACCONT_BLOCK , ACCOUNT_UNBLOCK
var update =  function(req,res) {
    logger.debug(`post request path:${req.path} (body: ${Object.keys(req.body)} values:${Object.values(req.body)})`);

    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    if( req.body.length < 0 ||
        typeof req.body.command === 'undefined' || typeof req.body.accountIdx === 'undefined' ) 
        return logger.error('request query error');

    let command = req.body.command;

    if(command === 'ACCOUNT_LOGOFF'){
        tcp.accountLogoff(req.body.accountIdx,function(response){
            // c9soft-sp_log변경
            // let query = `insert into tbl_log(ukey,idx,type,message) select ukey, ifnull(max(idx),-1)+1, 2, \'${command}\' FROM tbl_log where ukey=${req.body.ukey};`;
            // sql.execute_crmdb(query).then(result => {
            //     res.json({result:response});
            // }).catch(err =>{
            //     logger.error(`manager process error : ${err.message}`);
            //     res.json({result:err});
            // });
            insertCrmLog(req.body.ukey, clientIp, 2, command, message) // 공용 함수 호출
                .then(() => res.json({ result: response }))
                .catch(err => {
                    logger.error(`manager process error : ${err.message}`);
                    res.json({ result: err });
                });
        });
    }
    else if(command === 'ACCOUNT_BLOCK'){
        let message = command + ` => { accountIdx : ${req.body.accountIdx }, blockHours : ${req.body.blockHours}, blockReson : ${req.body.blockReason}}`;  
        tcp.accountBlock(req.body.accountIdx,req.body.blockHours,function(response){
            // c9soft-sp_log변경
            // let query = `insert into tbl_log(ukey,idx,type,message) select ukey, ifnull(max(idx),-1)+1, 2, \'${message}\' FROM tbl_log where ukey=${req.body.ukey};`;
            // sql.execute_crmdb(query).then(result => {
            //     res.json({result:response});
            // }).catch(err =>{
            //     logger.error(`manager process error : ${err.message}`);
            //     res.json({result:err});
            // });
            insertCrmLog(req.body.ukey, clientIp, 2, command, message) // 공용 함수 호출
                .then(() => res.json({ result: response }))
                .catch(err => {
                    logger.error(`manager process error : ${err.message}`);
                    res.json({ result: err });
                });
        });
    }
    else if(command === 'ACCOUNT_UNBLOCK'){
        let message = command + ` => { accountIdx : ${req.body.accountIdx}}`;  
        tcp.releaseAcountBlock(req.body.accountIdx,function(response){
            // c9soft-sp_log변경
            // let query = `insert into tbl_log(ukey,idx,type,message) select ukey, ifnull(max(idx),-1)+1, 2, \'${message}\' FROM tbl_log where ukey=${req.body.ukey};`;
            // sql.execute_crmdb(query).then(result => {
            //     res.json({result:response});
            // }).catch(err =>{
            //     logger.error(`manager process error : ${err.message}`);
            //     res.json({result:err});
            // });
            insertCrmLog(req.body.ukey, clientIp, 2, command, message) // 공용 함수 호출
                .then(() => res.json({ result: response }))
                .catch(err => {
                    logger.error(`manager process error : ${err.message}`);
                    res.json({ result: err });
                });            
        });
    }

}