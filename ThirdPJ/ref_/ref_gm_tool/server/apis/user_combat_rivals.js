const config = require('../../config');
const logger = require('../libs/logger')(config.log.dir,config.log.name,config.log.level);

const sql = require('../models/mysql-db');
const translate = require('../models/translate');

module.exports = function(app) {
    app.route('/api/user_combat_rivals').get(select).post(update); 
}

var select =  function(req,res) {
    logger.debug('get request path:' + req.path + ' (query:' + Object.keys(req.query) + ' values:' + Object.values(req.query) + ')');

    if(typeof req.query.userIdx === 'undefined' || req.query.userIdx.length < 0) 
        return logger.error('request query error');

    let worldIdx = req.query.worldIdx;
    let userIdx = req.query.userIdx;
    
    let query = 'select * from user_combat_rivals where user_idx='+ userIdx +';';
    sql.execute_gamedb(worldIdx,query).then(result => {
        translate.setItemName(result,function(output){
            res.json({result:output});
        });
    }).catch(err =>{
        logger.error('user combat rivals select error : ' + err.message );
        res.json({message:err});
    });
}

var update = function(req,res) {
}