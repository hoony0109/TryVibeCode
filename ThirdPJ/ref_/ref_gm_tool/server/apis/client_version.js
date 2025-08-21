const config = require('../../config');
const logger = require('../libs/logger')(config.log.dir,config.log.name,config.log.level);

const sql = require('../models/mysql-db');
const tcp = require('../models/tcp');

const { insertCrmLog } = require('../libs/logHelper'); // 공용 로그 함수 import

module.exports = function(app) {
    app.route('/api/client_version').get(select).post(update); 
}

var select =  function(req,res) {
    logger.debug(`get request path:${req.path} (query:${Object.keys(req.query)} values:${Object.values(req.query)})`);

    tcp.checkClientVersion(function(response,clientVersion){
        res.json({result:response,clientVersion:clientVersion});
    });
}

// command : CLIENT_VERSION
var update = function(req,res) {
    logger.debug(`post request path:${req.path} (body:${Object.keys(req.body)} values:${Object.values(req.body)})`);

    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    if( req.body.length < 0 ||
        typeof req.body.command === 'undefined' || typeof req.body.clientVersion === 'undefined'){
        res.json({result:'request error'});
        return logger.error('request body error');
    }

    let command = req.body.command;
    let message = `${command} => { clientVersion : ${req.body.clientVersion}}`; 

    tcp.changeClientVersion(req.body.clientVersion,function(response,clientVersion){
        // c9soft-sp_log변경
        // let query = `insert into tbl_log(ukey,idx,type,message) select ukey, ifnull(max(idx),-1)+1, 4, \'${message}\' FROM tbl_log where ukey=${req.body.ukey};`;
        // sql.execute_crmdb(query).then(result => {
        //     res.json({result:response,clientVersion:clientVersion});
        // }).catch(err =>{
        //     logger.error(`server version process error : ${err.message}`);
        //     res.json({result:err});
        // });
        insertCrmLog(req.body.ukey, clientIp, 4, command, message) // 공용 함수 호출
        .then((result) => {
            res.json({result:response,clientVersion:clientVersion});
        })
        .catch(err => {
            logger.error(`server version process error : ${err.message}`);
            res.json({ result: err });
        });        
    });
}