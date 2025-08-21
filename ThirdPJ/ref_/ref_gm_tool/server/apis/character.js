const config = require('../../config');
const logger = require('../libs/logger')(config.log.dir,config.log.name,config.log.level);

const sql = require('../models/mysql-db');
const translate = require('../models/translate');

const { insertCrmLog } = require('../libs/logHelper'); // 공용 로그 함수 import

module.exports = function(app) {
    app.route('/api/character').get(select).post(update); 
}

var select =  function(req,res) {
    logger.debug('get request path:' + req.path + ' (query:' + Object.keys(req.query) + ' values:' + Object.values(req.query) + ')');

    if(typeof req.query.userIdx === 'undefined' || req.query.userIdx.length < 0) 
        return logger.error('request query error');

    let worldIdx = req.query.worldIdx;
    let userIdx = req.query.userIdx;
    
    let query = 'select * from char_info where user_idx='  + userIdx + ';';
    sql.execute_gamedb(worldIdx,query).then(result => {
        translate.setCharacterName(result,function(output){
            translate.setCharacterLevel(result,function(output){
                res.json({result:output});
            });
        });  
    }).catch(err =>{
        logger.error('user character select error : ' + err.message );
        res.json({message:err});
    });
}

var update = function(req,res) {
    logger.debug('post request path:' + req.path + ' (body:' + Object.keys(req.body)  + ' values:' + Object.values(req.body) + ')');

    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    let command = req.body.command;

    if(command === 'CHARACTER_CHANGE_POS'){

        if(typeof req.body.worldIdx === 'undefined' || typeof req.body.userIdx === 'undefined' || typeof req.body.characterIdx === 'undefined' ||
            typeof req.body.posX === 'undefined' || typeof req.body.posZ === 'undefined' || typeof req.body.stage === 'undefined'){
            res.json({result:'request error'});
            return logger.error('request body error');
        }

        let worldIdx = req.body.worldIdx;
        let userIdx = req.body.userIdx;
        let characterIdx = req.body.characterIdx;

        let query = 'update char_info set region_pos_x='+req.body.posX+', region_pos_z='+req.body.posZ+', current_stage='+req.body.stage+' where char_idx='+ characterIdx +' and user_idx=' + userIdx + ' ;';
        sql.execute_gamedb(worldIdx,query).then(result => {
            // c9soft-sp_log변경
            // query = 'insert into tbl_log(ukey,idx,type,message) select ukey, ifnull(max(idx),-1)+1, 2, \''+command+'\' FROM tbl_log where ukey='+req.body.ukey+';';
            // sql.execute_crmdb(query).then(result => {
            //     res.json({result:result});
            // }).catch(err =>{
            //     logger.error('manager process error : ' + err.message );
            //     res.json({result:err});
            // });
            insertCrmLog(req.body.ukey, clientIp, 2, command, message) // 공용 함수 호출
                .then((result) => {
                    res.json({ result:result }); 
                })
                .catch(err => {
                    logger.error(`manager process error : ${err.message}`);
                    res.json({ result: err });
                });
        }).catch(err =>{
            logger.error('user post select error : ' + err.message );
            res.json({message:err});
        });
    }
}