const config = require('../../config');
const logger = require('../libs/logger')(config.log.dir,config.log.name,config.log.level);

const sql = require('../models/mysql-db');
const translate = require('../models/translate');
const dataManager = require('../libs/dataManager');

const { insertCrmLog } = require('../libs/logHelper'); // 공용 로그 함수 import

// api
// : user_iap
module.exports = function(app) {
    app.route('/api/user_iap').get(select).post(update); 
}

var select =  function(req,res) {
    logger.debug(`get request path:${req.path} (query:${Object.keys(req.query)} values:${Object.values(req.query)})`);

    if(typeof req.query.userIdx === 'undefined' || req.query.userIdx.length < 0) 
        return logger.error('request query error');

    dataManager.getAllData('Purchase_id').then(data => {
        let userIdx = req.query.userIdx;
        
        let query = `select * from w_iapdb.tbl_iap where user_id=${userIdx} order by txid_time;`;
        sql.execute_iapdb(query).then(result => {

            let products = Array.from(data.values());
            
            let mapPurchase = new Map();
            for(let i=0; i<products.length; i++){            
                mapPurchase.set(products[i].Purchase_Code_Aos, products[i].Name);  
            }

            for(let i=0; i<result.length; i++){
                let strName = mapPurchase.get(result[i].product_id);
                result[i].product_id = strName ?? result[i].product_id;
            }        

            res.json({result:result});
        }).catch(err =>{
            res.json({message:err});
        });
    }).catch(err =>{
        logger.error(`user-iap products select error : ${err.message}`);
        res.json({message:err});
    });
}

var update = function(req,res) {
    logger.debug(`post request path:${req.path} (body:${Object.keys(req.body)} values:${Object.values(req.body)})`);

    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    let command = req.body.command;

    if(command === 'IAP_GIVE_COMPLETE'){

        if(typeof req.body.userIdx === 'undefined' || typeof req.body.txid === 'undefined' || typeof req.body.giveComplete === 'undefined'){
            res.json({result:'request error'});
            return logger.error('request body error');
        }

        let userIdx = req.body.userIdx;

        let query = `update w_iapdb.tbl_iap set give_complete=${req.body.giveComplete} where txid=\'${req.body.txid}\' and user_id=${userIdx};`;
        sql.execute_iapdb(query).then(result => {
            // c9soft-sp_log변경
            // query = `insert into tbl_log(ukey,idx,type,message) select ukey, ifnull(max(idx),-1)+1, 2, \'${command}\' FROM tbl_log where ukey=${req.body.ukey};`;
            // sql.execute_crmdb(query).then(result => {
            //     res.json({result:result});
            // }).catch(err =>{
            //     logger.error(`manager process error : ${err.message}`);
            //     res.json({result:err});
            // });
            insertCrmLog(req.body.ukey, clientIp, 2, command, message).then((result) => {
                res.json({ result:result }); 
            }).catch(err => {
                logger.error(`manager process error : ${err.message}`);
                res.json({ result: err });
            });
        }).catch(err =>{
            logger.error(`user IAP select error : ${err.message}`);
            res.json({message:err});
        });
    }
}