const config = require('../../config');
const logger = require('../libs/logger')(config.log.dir,config.log.name,config.log.level);
const dataManager = require('../libs/dataManager');

const sql = require('../models/mysql-db');
const translate = require('../models/translate');

const { insertCrmLog } = require('../libs/logHelper'); // 공용 로그 함수 import

module.exports = function(app) {
    app.route('/api/post').get(select).post(update); 
}

var select =  function(req,res) {
    logger.debug(`get request path:${req.path} (query:${Object.keys(req.query)} values:${Object.values(req.query)})`);
}

// send all mail
var update = function(req,res) {
    logger.debug(`post request path:${req.path} (body:${Object.keys(req.body)} values:${Object.values(req.body)})`);

    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    if(typeof req.body.senderNickname === 'undefined' || req.body.senderNickname === ''){
        res.json({result:'request error, msg(sender name is empty)'});
        return logger.error('request body error, msg(sender name is empty');
    }
    if(typeof req.body.msg === 'undefined' || req.body.msg === ''){
        res.json({result:'request error, msg(message is empty)'});
        return logger.error('request body error, msg(message is empty');
    }
    if(typeof req.body.expireDays === 'undefined' || req.body.expireDays < 1){
        res.json({result:'request error, msg(expire-days must be at least one)'});
        return logger.error('request body error, msg(expire-days must be at least one');
    }

    let command = req.body.command;

    let senderNickname = req.body.senderNickname;
    let msg = req.body.msg;
    let expireDays = Number(req.body.expireDays);
    let attachedItemType = 0;
    let attachedItem = Number(req.body.attachedItem);
    let attachedItemValue = attachedItem>0 ? Number(req.body.attachedItemValue) : 0;

    let message = `${command} => { msg : ${req.body.msg}, attachedItem : ${req.body.attachedItem}, attachedItemValue : ${req.body.attachedItemValue}}`;  

    if(attachedItem > 0){
        dataManager.getData('Item_Name',attachedItem).then(data => {
            if(data) attachedItemType = Number(data.Type);
        
            let query = 'insert into user_post(user_idx, send_idx, sender_nick, sender_char_id, sender_gamedb_idx, guild_idx, guild_name, guild_mark_id, char_id, post_type, post_text_idx, message, expire_date, item_type, item_id, item_value) ';
            query += `select user_idx, 0, \'${senderNickname}\', 0, 0, 0, \'\', 0, 0, 1, 0, \'${msg}\', date_add(now(), interval + ${expireDays} day), ${attachedItemType}, ${attachedItem}, ${attachedItemValue} from userinfo;`;
            sql.execute_all_gamedb(query).then(result => {
                // c9soft-sp_log변경
                //query = `insert into tbl_log(ukey,idx,type,message) select ukey, ifnull(max(idx),-1)+1, 4, \'${message}\' FROM tbl_log where ukey=${req.body.ukey};`;
                //sql.execute_crmdb(query).then(result => {
                //  res.json({result:result});
                // }).catch(err =>{
                //     logger.error(`manager process error : ${err.message}`);
                //     res.json({result:err});
                // });
                insertCrmLog(req.body.ukey, clientIp, 4, command, message).then((result) => {
                    res.json({ result:result }); 
                }).catch(err => {
                    logger.error(`manager process error : ${err.message}`);
                    res.json({ result: err });
                });
            }).catch(err =>{
                logger.error(`all user post select error : ${err.message}`);
                res.json({message:err});
            });
        }); 
    }
    else{
        let query = 'insert into user_post(user_idx, send_idx, sender_nick, sender_char_id, sender_gamedb_idx, guild_idx, guild_name, guild_mark_id, char_id, post_type, post_text_idx, message, expire_date, item_type, item_id, item_value) ';
            query += `select user_idx, 0, \'${senderNickname}\', 0, 0, 0, \'\', 0, 0, 1, 0, \'${msg}\', date_add(now(), interval + ${expireDays} day), 0, 0, 0 from userinfo;`;
        sql.execute_all_gamedb(query).then(result => {
            // c9soft-sp_log변경
            // query = `insert into tbl_log(ukey,idx,type,message) select ukey, ifnull(max(idx),-1)+1, 4, \'${message}\' FROM tbl_log where ukey=${req.body.ukey};`;
            // sql.execute_crmdb(query).then(result => {
            //  res.json({result:result});
            // }).catch(err =>{
            //     logger.error(`manager process error : ${err.message}`);
            //     res.json({result:err});
            // });
            insertCrmLog(req.body.ukey, clientIp, 4, command, message).then((result) => {
                res.json({ result:result }); 
            }).catch(err => {
                logger.error(`manager process error : ${err.message}`);
                res.json({ result: err });
            });
        }).catch(err =>{
            logger.error(`all user post select error : ${err.message}`);
            res.json({message:err});
        });
    }
    
    
}