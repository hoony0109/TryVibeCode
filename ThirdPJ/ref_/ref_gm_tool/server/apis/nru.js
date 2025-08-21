const config = require('../../config');
const logger = require('../libs/logger')(config.log.dir,config.log.name,config.log.level);

const sql = require('../models/mysql-db');

module.exports = function(app) {
    app.route('/api/nru').get(select).post(update); 
}

var select =  function(req,res) {
    logger.debug('get request path:' + req.path + ' (query:' + Object.keys(req.query) + ' values:' + Object.values(req.query) + ')');

    if(typeof req.query.days === 'undefined') 
        return logger.error('request query error');

    let query = '';
    for(let i=0;i<req.query.days; i++){
        if(i>0) query += ' union ';
        query += 'select curdate() + interval - '+i+' day as date, count(*) as count from w_globaldb.line_account where date_format(reg_date, "%Y-%m-%d") = curdate() + interval - '+ i +' day';
    }
    query += ';';

    sql.execute_globaldb(query).then(result => {
        res.json({result:result});
    }).catch(err =>{
        logger.error('manager process error : ' + err.message );
        res.json({message:err});
    });
}

var update = function(req,res) {
}