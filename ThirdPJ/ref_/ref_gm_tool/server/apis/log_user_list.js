const config = require('../../config');
const logger = require('../libs/logger')(config.log.dir,config.log.name,config.log.level);

const sql = require('../models/mysql-db');
const mongo = require('../models/mongo')
const translate = require('../models/translate');

module.exports = function(app) {
    app.route('/api/log_user_list').get(select).post(update); 
}

var select =  function(req,res) {
    logger.debug('get request path:' + req.path + ' (query:' + Object.keys(req.query) + ' values:' + Object.values(req.query) + ')');

    if(typeof req.query.world === 'undefined'|| typeof req.query.postfix === 'undefined') return logger.error('request query error');

    mongo.getCollections(req.query.world,req.query.postfix).then(result => {
        //logger.debug('get collection count : ' + result.length +', data : ' + JSON.stringify(result)) ;
        let collectionNames = [];
        for(let i=0; i<result.length; i++){
            collectionNames.push({name:result[i].name});
        }
        collectionNames = collectionNames.sort(compare);
        res.json({result:collectionNames});  
        //logger.debug('get collection names : ' + JSON.stringify(collectionNames)) ;
    }).catch(err =>{
        res.json({message:err});
    });

    function compare(a, b) {
        // Use toUpperCase() to ignore character casing
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
      
        let comparison = 0;
        if (nameA > nameB) {
          comparison = 1;
        } else if (nameA < nameB) {
          comparison = -1;
        }
        return comparison;
    }
}

var update = function(req,res) {
}