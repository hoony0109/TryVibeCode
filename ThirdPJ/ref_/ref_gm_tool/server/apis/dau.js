const { now } = require('lodash');
const config = require('../../config');
const logger = require('../libs/logger')(config.log.dir,config.log.name,config.log.level);

const sql = require('../models/mysql-db');

module.exports = function(app) {
    app.route('/api/dau').get(select).post(update); 

    //set dau scheduler by 5 min.
    //onTimer();
    //setInterval( () => { onTimer(); }, 300000);
}

/*
function onTimer(){
    let query = 'select (select count(*) from w_globaldb.line_account_world where date_format(reg_date, "%Y-%m-%d") = curdate()) as nru, (select count(*) from w_globaldb.line_account_world where date_format(last_login_date, "%Y-%m-%d") = curdate()) as dau;';
    sql.execute_globaldb(query).then(result => {
        logger.debug('dau onTimer result : ' + JSON.stringify(result) );
        query = 'insert into crmdb.tbl_attendance(date, nru, dau) values(date_format(now(), "%Y-%m-%d"),'+ result[0].nru +','+result[0].dau +') on duplicate key update nru ='+result[0].nru+', dau='+result[0].dau+', lastDate=now();';
        sql.execute_crmdb(query).then(result => {
        }).catch(err =>{
            logger.error('dau onTimer process error : ' + err.message );
        });
    }).catch(err =>{
        logger.error('dau onTimer process error : ' + err.message );
    });
}
*/

var select =  function(req,res) {
    logger.debug('get request path:' + req.path + ' (query:' + Object.keys(req.query) + ' values:' + Object.values(req.query) + ')');

    if(typeof req.query.days === 'undefined') 
        return logger.error('request query error');

    let query = '';
    for(let i=0; i<req.query.days; i++){
        if(i>0) query += ' union ';
        //query += '(select curdate() + interval - '+i+' day as date, fld_dau as dau from w_globaldb._analysis_dau where date_format(fld_date, "%Y-%m-%d") = curdate() + interval - '+ i +' day order by fld_date desc limit 1)';
        query += `(select curdate() + interval - ${i} day as date, fld_dau as dau from w_globaldb._analysis_dau where date_format(fld_date, "%Y-%m-%d") = curdate() + interval - ${i} day order by fld_date desc limit 1)`;
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