const config = require('../../config');
const logger = require('../libs/logger')(config.log.dir,config.log.name,config.log.level);

const sql = require('../models/mysql-db');
const mongo = require('../models/mongo');
const translate = require('../models/translate');

module.exports = function(app) {
    app.route('/api/log_user').get(select).post(update); 
}

var select =  function(req,res) {
    logger.debug('get request path:' + req.path + ' (query:' + Object.keys(req.query) + ' values:' + Object.values(req.query) + ')');

    if(typeof req.query.world === 'undefined'|| typeof req.query.postfix === 'undefined' || typeof req.query.logName === 'undefined' ||
    typeof req.query.startTime === 'undefined' || typeof req.query.endTime === 'undefined' || typeof req.query.page === 'undefined' ) 
        return logger.error('request query error');

    let page = Number(req.query.page) > 0 ? Number(req.query.page) : 1;
    let nick = req.query.nick;

    mongo.findDocument(req.query.world,req.query.postfix,req.query.logName,req.query.startTime,req.query.endTime,page,nick).then(result => {
        //logger.debug('get collection count : ' + result.length +', data : ' + JSON.stringify(result)) ;
        translate.setItemName(result,function(output){
            res.json({result:output});
        });
        //res.json({result:result});  
        //logger.debug('get logs : ' + JSON.stringify(result)) ;
    }).catch(err =>{
        res.json({message:err});
    });
}

var update = function(req,res) {
}