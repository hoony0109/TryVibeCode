const config = require('../../config');
const logger = require('../libs/logger')(config.log.dir,config.log.name,config.log.level);
const dataManager = require('../libs/dataManager');

const sql = require('../models/mysql-db');

module.exports = function(app) {
    app.route('/api/complaint').get(select).post(update);
}

// 신고 목록 얻기
var select =  function(req,res) {
    //logger.debug('get request path:' + req.path + ' (query:' + Object.keys(req.query) + ' values:' + Object.values(req.query) + ')');

    let query = 'SELECT complaint_id, reg_date, world_id, user_idx, nickname, target_user_idx, target_nickname, msg, chat, complete FROM tbl_complaint order by complaint_id desc;';
    sql.execute_crmdb(query).then(result => {
        res.json({result:result});  
    }).catch(err =>{
        res.json({message:err});
    });
}

// 신고 처리 완료 설정
var update = function(req,res) {
//    logger.debug('post request path:' + req.path + ' (body:' + Object.keys(req.body)  + ' values:' + Object.values(req.body) + ')');

    let command = req.body.command;

    if(command === 'UPDATE_COMPLETE'){
        // 처리 상태 변경
        if(typeof req.body.complaint_id === 'undefined'){
            res.json({result:'request error'});
            return logger.error('request body error');
        }

        let query = `update tbl_complaint set complete = CASE WHEN complete = 0 THEN 1 ELSE 0 END where complaint_id = ${req.body.complaint_id};`;
        sql.execute_crmdb(query).then(result => {
            logger.debug(`update complaint_id : ${req.body.complaint_id}`);
            res.json({result:result});

            // let query = 'SELECT complaint_id, reg_date, world_id, user_idx, nickname, target_user_idx, target_nickname, msg FROM tbl_complaint order by complaint_id desc;';
            // sql.execute_crmdb(query).then(result => {
            //     res.json({result:result});  
            // }).catch(err =>{
            //     res.json({message:err});
            // });

            // res.json({result:result});

            // let message = command + ` => {type_id:${req.body.type_id}}`;  
            // query = `insert into tbl_log(ukey,idx,type,message) select ukey, ifnull(max(idx),-1)+1, 6, \'${message}\' FROM tbl_log where ukey=${req.body.ukey};`;
            // sql.execute_crmdb(query).then(result => {
            // }).catch(err =>{
            //     logger.error(`manager process error : ${err.message}`);
            // });            
        }).catch(err =>{
            logger.error(`update complaint state error : ${err.message} `);
            res.json({result:err});
        });
    }
}