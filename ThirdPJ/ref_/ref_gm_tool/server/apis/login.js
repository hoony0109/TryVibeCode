const config = require('../../config');
const logger = require('../libs/logger')(config.log.dir,config.log.name,config.log.level);

const sql = require('../models/mysql-db');
const md5 = require("md5"); 

// api
// : user login
module.exports = function(app) {
    app.route('/api/login').get(execute).post(execute); 
}

var execute =  function(req,res) {
    logger.debug(`get request path:${req.path} (query:${Object.keys(req.query)} values:${Object.values(req.query)})`);
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    if(typeof req.query.id === 'undefined' || req.query.id.length < 0) 
        return logger.error('request query error');

    if(typeof req.query.pwd === 'undefined' || req.query.pwd.length < 0) 
        return logger.error('request query error');
    
     let id = (req.query.id.length > 0) ? req.query.id : req.body.id;
     let pwd = (req.query.pwd.length > 0) ? md5(req.query.pwd) : md5(req.body.pwd);

    //sql.execute_crmdb('call csp_login(?,?,@result,@ukey,@grade); select @result,@ukey,@grade;',[id,pwd]).then(result => {
    sql.execute_crmdb('call csp_login2(?,?,?,@result,@ukey,@grade); select @result,@ukey,@grade;',[id,pwd,clientIp]).then(result => {
  
        let loginResult = result[result.length-1][0]['@result']; 
        let ukey = result[result.length-1][0]['@ukey'];
        let grade = result[result.length-1][0]['@grade'];
        
        logger.debug(`loginResult:${loginResult} ukey:${ukey} grade:${grade}`);
        res.json({result:{loginResult:loginResult,ukey:ukey,grade:grade}});
  
    }).catch(err =>{
        logger.error(`login process error : ${err.message}`);
        res.json({message:err});
    });

}