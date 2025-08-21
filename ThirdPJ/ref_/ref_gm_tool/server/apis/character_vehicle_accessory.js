const config = require('../../config');
const logger = require('../libs/logger')(config.log.dir,config.log.name,config.log.level);

const sql = require('../models/mysql-db');
const translate = require('../models/translate');

module.exports = function(app) {
    app.route('/api/character_vehicle_accessory').get(select).post(update); 
}

var select =  function(req,res) {
    logger.debug('get request path:' + req.path + ' (query:' + Object.keys(req.query) + ' values:' + Object.values(req.query) + ')');

    if(typeof req.query.userIdx === 'undefined' || req.query.userIdx.length < 0) 
        return logger.error('request query error');

    if(typeof req.query.characterIdx === 'undefined' || req.query.characterIdx.length < 0) 
        return logger.error('request query error');

    let worldIdx = req.query.worldIdx;
    let userIdx = req.query.userIdx;
    let characterIdx = req.query.characterIdx;
    
    let query = 'select item_idx,item_id,item_level,vehicle_idx,belong from char_inven_vehicle_equip where char_idx='+ characterIdx +';';
    sql.execute_gamedb(worldIdx,query).then(result => {
        translate.setItemName(result,function(output){
            res.json({result:output});
        });
    }).catch(err =>{
        logger.error('user character inven vehicle accessory select error : ' + err.message );
        res.json({message:err});
    });
}

var update = function(req,res) {
}