const config = require('../../config');
const logger = require('../libs/logger')(config.log.dir,config.log.name,config.log.level);

const sql = require('../models/mysql-db');
const md5 = require("md5"); 

const { insertCrmLog } = require('../libs/logHelper'); // 공용 로그 함수 import


module.exports = function(app) {
    app.route('/api/manager').get(select).post(update); 
}

var select =  function(req,res) {
    logger.debug(`get request path:${req.path} (query:${Object.keys(req.query)} values:${Object.values(req.query)})`);

    let query = 'select ukey, id, grade,blocked, createDate, lastDate from crmdb.tbl_account;';
    sql.execute_crmdb(query).then(result => {
        res.json({result:result});
    }).catch(err =>{
        logger.error(`manager process error : ${err.message}`);
        res.json({message:err});
    });
}

// command : MANAGER_CREATE
var update =  function(req,res) {
    logger.debug(`post request path:${req.path} (body:${Object.keys(req.body)} values:${Object.values(req.body)})`);

    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    if( req.body.length < 0 || typeof req.body.command === 'undefined' || typeof req.body.managerId === 'undefined' || typeof req.body.managerPwd === 'undefined' || typeof req.body.managerGrade === 'undefined'){
        res.json({result:2});
        return logger.error('request query error');
    }

    if(req.body.managerId === '' || req.body.managerPwd === ''){        
        res.json({result:3});
        return logger.error('required data is empty.');
    }

    if(req.body.managerId == req.body.managerPwd){
        res.json({result:4});
        return logger.error('required data is empty.');
    }    

    let command = req.body.command;
    let message = `${command} => { managerId : ${req.body.managerId}}`;

    let pwd = md5(req.body.managerPwd);

    if(command === 'MANAGER_CREATE'){        
        // c9soft-sp_log변경
        //let query = `insert into crmdb.tbl_account(id,pwd,grade) values(\'${req.body.managerId}\',\'${pwd}\',${req.body.managerGrade}); `;
        //query += `insert into tbl_log(ukey,idx,type,message) select ukey, ifnull(max(idx),-1)+1, 5, \'${message}\' FROM tbl_log where ukey=${req.body.ukey};`;
        let query = `insert into crmdb.tbl_account(id, pwd, grade) values(?, ?, ?);`;
        let params = [req.body.managerId, pwd, req.body.managerGrade];
        sql.execute_crmdb(query, params).then(result => {
            res.json({result:result});

            insertCrmLog(req.body.ukey, clientIp, 5, command, message).then(() => {
            }).catch(err => {
                logger.error(`manager process error : ${err.message}`);
            });            
        }).catch(err =>{
            logger.error(`manager process error : ${err.message}`);
            res.json({result:err});
        });
    }

}