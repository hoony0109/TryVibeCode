const config = require('../../config');
const logger = require('../libs/logger')(config.log.dir,config.log.name,config.log.level);
const dataManager = require('../libs/dataManager');

const sql = require('../models/mysql-db');
const translate = require('../models/translate');

const { insertCrmLog } = require('../libs/logHelper'); // 공용 로그 함수 import


module.exports = function(app) {
    app.route('/api/sendItems').get(select).post(update); 
}

var select =  function(req,res) {
    logger.debug(`get request path:${req.path} (query:${Object.keys(req.query)} values:${Object.values(req.query)})`);
}

// send items
var update = function(req,res) {
    logger.debug(`post request path:${req.path} (body:${Object.keys(req.body)} values:${Object.values(req.body)} )`);

    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    if(typeof req.body.batchData === 'undefined'){
        res.json({result:'request error'});
        return logger.error('request body error');
    }
    
    let command = req.body.command;
    let batchData = JSON.parse(req.body.batchData);

    let query = '';
    let sendItemslog = '';
    for(let i=0; i<batchData.length; i++){

        let user_idxs = [];
        if(typeof(batchData[i][0]) === 'number')
            user_idxs.push(batchData[i][0].toString())
        else  
            user_idxs = batchData[i][0].replace(/(\r\n\t|\r\n|\n|\r\t)/gm,"").split(',').map(function(idx) {return parseInt(idx, 10);});
        
        let item_type = 0;
        let user_ids = batchData[i][0];
        let item_id = Number(batchData[i][1]);
        let item_value = Number(batchData[i][2]);
        let expire_days = Number(batchData[i][3]);
        let sender_nick = batchData[i][4];
        let send_message = batchData[i][5];

        dataManager.getData('Item_Name',item_id).then(data => {
            if(0 < item_id) {
                if(data) item_type = Number(data.Type);

                query += 'insert into user_post(user_idx, send_idx, sender_nick, sender_char_id, sender_gamedb_idx, guild_idx, guild_name, guild_mark_id, char_id, post_type, post_text_idx, message, expire_date, item_type, item_id, item_value) ';
                query += `select user_idx, 0, \'${sender_nick}\', 0, 0, 0, \'\', 0, 0, 1, 0, \'${send_message}\', date_add(now(), interval + ${expire_days} day), ${item_type}, ${item_id}, ${item_value} from userinfo`;
                if(0 < user_idxs.length){
                    query += ' where '
                    for(let j=0; j<user_idxs.length; j++){
                        query += `user_idx = ${user_idxs[j]}`;
                        query +=  (j+1 < user_idxs.length) ? ' or ' :  ';';
                    }
                }
                else{
                    // query += ';';
                    let error = `user_idx is empty (${i})`;
                    logger.error(`send items error  : ${error}`);
                    return res.json({message:error});                    
                }

                // execute db
                sendItemslog += `(${item_id}, ${item_value}, {${user_ids}})`;
                if(batchData.length == i+1){
                    logger.debug(`send items query : ${query}`);
                    sql.execute_all_gamedb(query).then(result => {
                        let message = command + ` => { msg : send items by excel , sendItems : ${sendItemslog}}`;  
                        // c9soft-sp_log변경
                        //query = `insert into tbl_log(ukey,idx,type,message) select ukey, ifnull(max(idx),-1)+1, 4, \'${message}\' FROM tbl_log where ukey=${req.body.ukey};`;
                        //sql.execute_crmdb(query).then(result => {
                        //  return res.json({result:result});
                        // }).catch(err =>{
                        //     logger.error(`manager process error : ${err.message}`);
                        //     return res.json({result:err});
                        // });
                        insertCrmLog(req.body.ukey, clientIp, 4, command, message).then((result) => {
                            res.json({ result:result }); 
                        }).catch(err => {
                            logger.error(`manager process error : ${err.message}`);
                            res.json({ result: err });
                        });                        
                    }).catch(err =>{
                        logger.error(`send items error : ${err.message}`);
                        return res.json({message:err});
                    });
                }
            }
            else {
                let error = `unknown item (${item_id})`;
                logger.error(`send items error  : ${error}`);
                return res.json({message:error});
            }            
        }).catch(err =>{
            logger.error(`send items error  : ${err.message}`);
            return res.json({message:err});
        });   
    }
}