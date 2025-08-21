const config = require('../../config');
const logger = require('../libs/logger')(config.log.dir,config.log.name,config.log.level);

const sql = require('../models/mysql-db');
const translate = require('../models/translate');

// api
// : user_title
module.exports = function(app) {
    app.route('/api/user_title').get(select).post(update); 
}

var select =  function(req,res) {
    logger.debug(`get request path:${req.path} (query:${Object.keys(req.query)} values:${Object.values(req.query)})`);

    if(typeof req.query.userIdx === 'undefined' || req.query.userIdx.length < 0) 
        return logger.error('request query error');

    let worldIdx = req.query.worldIdx;
    let userIdx = req.query.userIdx;
    
    let query = `select * from user_title where user_idx=${userIdx};`;
    sql.execute_gamedb(worldIdx,query).then(result => {
        translate.setUserTitle(result,function(output){
            res.json({result:output});
        });  
    }).catch(err =>{
        res.json({message:err});
    });
}

var update = function(req,res) {
}