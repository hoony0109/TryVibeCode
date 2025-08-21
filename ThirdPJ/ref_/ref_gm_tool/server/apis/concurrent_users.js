const config = require('../../config');
const logger = require('../libs/logger')(config.log.dir,config.log.name,config.log.level);

const sql = require('../models/mysql-db');
const tcp = require('../models/tcp');

// api
// : concurrent_users
// : 동시 접속자 정보
module.exports = function(app) {
    app.route('/api/concurrent_users').get(select).post(update); 
}

var select =  function(req,res) {
    logger.debug(`get request path:${req.path} (query:${Object.keys(req.query)} values:${Object.values(req.query)})`);

    tcp.getConcurrentUsers(function(response,concurrentUsers){
        //logger.debug(`get Concurrent Users: ${concurrentUsers}`);
        res.json({result:response, concurrentUsers:concurrentUsers});
    });
}

var update = function(req,res) {
}
