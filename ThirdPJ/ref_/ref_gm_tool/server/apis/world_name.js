const config = require('../../config');
const logger = require('../libs/logger')(config.log.dir,config.log.name,config.log.level);

const sql = require('../models/mysql-db');
const dataManger = require('../libs/dataManager');

// api
// : world idx 목록 얻기
module.exports = function(app) {
    app.route('/api/world_name').get(select).post(select); 
}

var select =  function(req,res) {
    logger.debug(`get request path:${req.path} (query:${Object.keys(req.query)} values:${Object.values(req.query)})`);

    /*
    let query = 'select world_idx from w_globaldb.line_account_world group by world_idx;';
    sql.execute_globaldb(query).then(result => {
        res.json({result:result});
    }).catch(err =>{
        logger.error(`world_name process error : ${err.message}`);
        res.json({message:err});
    });
    */
   // _SHOW_WORLD_NAME
   // world_name, world_idx, sub_world_idx
    let query = 'SELECT world_name, world_idx, world_idx AS sub_world_idx FROM setting_world_common UNION \
                SELECT sub.sub_world_name AS world_name, sub.world_idx, sub.sub_world_idx FROM setting_world_common_subworld sub  ORDER BY world_idx, sub_world_idx;';
    sql.execute_setdb(query).then(result => {
        res.json({result:result});
    }).catch(err =>{
        logger.error(`world_name process error : ${err.message}`);
        res.json({message:err});
    });   
}
