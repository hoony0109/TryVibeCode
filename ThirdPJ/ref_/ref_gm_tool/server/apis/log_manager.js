const config = require('../../config');
const logger = require('../libs/logger')(config.log.dir,config.log.name,config.log.level);

const sql = require('../models/mysql-db');
const translate = require('../models/translate');

module.exports = function(app) {
    app.route('/api/log_manager').get(select).post(update); 
}

var select =  function(req,res) {
    logger.debug('get request path:' + req.path + ' (query:' + Object.keys(req.query) + ' values:' + Object.values(req.query) + ')');

    if(typeof req.query.page === 'undefined'|| Number(req.query.page) < 1) return logger.error('request query error');

    // c9soft-sp_log변경
    //let query = 'select b.id,a.type,a.message as command,a.createDate as date from crmdb.tbl_log a join tbl_account b on a.ukey = b.ukey order by a.createDate desc limit '+ Number(req.query.page-1)*100 + ',100;';
    let query = 'select b.id,a.type,a.message as command,a.createDate as date, ip_address from crmdb.tbl_log a join tbl_account b on a.ukey = b.ukey order by a.createDate desc limit '+ Number(req.query.page-1)*100 + ',100;';
    sql.execute_crmdb(query).then(result => {
        res.json({result:result});  
    }).catch(err =>{
        res.json({message:err});
    });
}

var update = function(req,res) {
}