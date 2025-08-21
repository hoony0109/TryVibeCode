const config = require('../../config');
const logger = require('../libs/logger')(config.log.dir,config.log.name,config.log.level);
const dataManager = require('../libs/dataManager');

const sql = require('../models/mysql-db');
const translate = require('../models/translate');

const { insertCrmLog } = require('../libs/logHelper'); // 공용 로그 함수 import


// api
// : user_post
module.exports = function(app) {
    app.route('/api/user_post').get(select).post(update); 
}

var select =  function(req,res) {
    logger.debug(`get request path:${req.path} (query:${Object.keys(req.query)} values:${Object.values(req.query)})`);

    if(typeof req.query.userIdx === 'undefined' || req.query.userIdx.length < 0 ||
        typeof req.query.page === 'undefined') 
        return logger.error('request query error');

    let worldIdx = req.query.worldIdx;
    let userIdx = req.query.userIdx;
    let page = req.query.page;
    
    let query = `select * from user_post where user_idx=${userIdx} and timestampdiff(DAY,reg_date,now()) <= 30 order by reg_date desc limit ${Number(page-1)*50},50;`;
    sql.execute_gamedb(worldIdx,query).then(result => {
        translate.setItemName(result,function(output){
            res.json({result:output});
        });
    }).catch(err =>{
        logger.error(`user post select error : ${err.message}`);
        res.json({message:err});
    });
}

// send mail
var update = function(req,res) {
    logger.debug(`post request path:${req.path} (body:${Object.keys(req.body)} values:${Object.values(req.body)})`);
    
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    let command = req.body.command;
  
    if(command === 'SEND_POST'){

        if( typeof req.body.worldIdx === 'undefined' || typeof req.body.userIdx === 'undefined' || 
            typeof req.body.senderNickname === 'undefined' || typeof req.body.msg === 'undefined' || req.body.expireDays === 'undefined'){
            res.json({result:'request error'});
            return logger.error('request body error');
        }

        let worldIdx = req.body.worldIdx;
        let userIdx = req.body.userIdx;
        let senderNickname = req.body.senderNickname;
        let msg = req.body.msg;
        let expireDays = Number(req.body.expireDays);
        let attachedItemType = 0;
        let attachedItem = Number(req.body.attachedItem);
        let attachedItemValue = attachedItem>0 ? Number(req.body.attachedItemValue) : 0;

        if(attachedItem > 0){
            let message = `${command} => { worldIdx : ${req.body.worldIdx} , userIdx : ${req.body.userIdx} , attachedItem : ${req.body.attachedItem} , attachedItemValue : ${req.body.attachedItemValue} }`;  
            dataManager.getData('Item_Name',attachedItem).then(data => {
                if(data) attachedItemType = Number(data.Type);
            
                let query = 'insert into user_post(user_idx, send_idx, sender_nick, sender_char_id, sender_gamedb_idx, guild_idx, guild_name, guild_mark_id, char_id, post_type, post_text_idx, message, expire_date, item_type, item_id, item_value) ';
                query += `select user_idx, 0, \'${senderNickname}\', 0, 0, 0, \'\', 0, 0, 1, 0, \'${msg}\', date_add(now(), interval + ${expireDays} day), ${attachedItemType}, ${attachedItem}, ${attachedItemValue} from userinfo`;
                query += ` where user_idx = ${userIdx};`;
                sql.execute_gamedb(worldIdx,query).then(result => {
                    // c9soft-sp_log변경
                    // query = `insert into tbl_log(ukey,idx,type,message) select ukey, ifnull(max(idx),-1)+1, 2, \'${message}\' FROM tbl_log where ukey=${req.body.ukey};`;
                    // sql.execute_crmdb(query).then(result => {
                    //     res.json({result:result});
                    // }).catch(err =>{
                    //     logger.error(`manager process error : ${err.message}`);
                    //     res.json({result:err});
                    // });
                    insertCrmLog(req.body.ukey, clientIp, 2, command, message).then((result) => {
                        res.json({ result:result }); 
                    }).catch(err => {
                        logger.error(`manager process error : ${err.message}`);
                        res.json({ result: err });
                    });
                }).catch(err =>{
                    logger.error(`user post select error : ${err.message}`);
                    res.json({message:err});
                });
            }); 
        }
        else{
            let message = `${command} => { worldIdx : ${req.body.worldIdx}, userIdx : ${req.body.userIdx}, attachedItem : ${req.body.attachedItem}, attachedItemValue : ${req.body.attachedItemValue}}`;  
            
            let query = 'insert into user_post(user_idx, send_idx, sender_nick, sender_char_id, sender_gamedb_idx, guild_idx, guild_name, guild_mark_id, char_id, post_type, post_text_idx, message, expire_date, item_type, item_id, item_value) ';
                query += `select user_idx, 0, \'${senderNickname}\', 0, 0, 0, \'\', 0, 0, 1, 0, \'${msg}\', date_add(now(), interval + ${expireDays} day), 0, 0, 0 from userinfo`;
                query += ` where user_idx = ${userIdx};`;
            
            sql.execute_gamedb(worldIdx,query).then(result => {
                // c9soft-sp_log변경
                // query = `insert into tbl_log(ukey,idx,type,message) select ukey, ifnull(max(idx),-1)+1, 2, \'${message}\' FROM tbl_log where ukey=${req.body.ukey};`;
                // sql.execute_crmdb(query).then(result => {
                //     res.json({result:result});
                // }).catch(err =>{
                //     logger.error(`manager process error : ${err.message}`);
                //     res.json({result:err});
                // });
                insertCrmLog(req.body.ukey, clientIp, 2, command, message).then((result) => {
                    res.json({ result:result }); 
                }).catch(err => {
                    logger.error(`manager process error : ${err.message}`);
                    res.json({ result: err });
                });
            }).catch(err =>{
                logger.error(`user post select error : ${err.message}`);
                res.json({message:err});
            });
        }
        
    }
    else if(command === 'DELETE_POST'){
        if( typeof req.body.worldIdx === 'undefined' || typeof req.body.postIdx === 'undefined' || typeof req.body.userIdx === 'undefined'){
            res.json({result:'request error'});
            return logger.error('request body error');
        }

        let worldIdx = req.body.worldIdx;
        let postIdx = req.body.postIdx;
        let userIdx = req.body.userIdx;

        let message = `${command} => { worldIdx : ${req.body.worldIdx} , userIdx : ${req.body.userIdx}, postIdx : ${req.body.postIdx} }`;  
            
        let query = `update user_post set expire_date = date_sub(reg_date, interval 30 day),reg_date = date_sub(reg_date, interval 30 day) where post_idx = ${postIdx} and user_idx = ${userIdx};`;
        sql.execute_gamedb(worldIdx,query).then(result => {
            // c9soft-sp_log변경
            // query = `insert into tbl_log(ukey,idx,type,message) select ukey, ifnull(max(idx),-1)+1, 2, \'${message}\' FROM tbl_log where ukey=${req.body.ukey};`;
            // sql.execute_crmdb(query).then(result => {
            //     res.json({result:result});
            // }).catch(err =>{
            //     logger.error(`manager process error : ${err.message}`);
            //     res.json({result:err});
            // });
            insertCrmLog(req.body.ukey, clientIp, 2, command, message).then((result) => {
                res.json({ result:result }); 
            }).catch(err => {
                logger.error(`manager process error : ${err.message}`);
                res.json({ result: err });
            });
        }).catch(err =>{
            logger.error(`user post select error : ${err.message}`);
            res.json({message:err});
        });
    }
}