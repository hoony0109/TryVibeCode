const config = require('../../config');
const logger = require('../libs/logger')(config.log.dir,config.log.name,config.log.level);

const sql = require('../models/mysql-db');
const dataManager = require('../libs/dataManager');

// api
// : in_app
// : 결제 아이템 판매 수량 정보
module.exports = function(app) {
    app.route('/api/in_app').get(select).post(update); 
}

var select =  function(req,res) {
    //logger.debug(`get request path:${req.path} (query:${Object.keys(req.query)} values:${Object.values(req.query)})`);

    if(typeof req.query.days === 'undefined') 
        return logger.error('request query error');

    dataManager.getAllData('Purchase_id').then(data => {
        let products = Array.from(data.values());
        //logger.debug(`get iapdb products : ${JSON.stringify(products)} length : ${products.length}`);
        
        let mapPurchase = new Map();
        for(let i=0; i<products.length; i++){            
            //if(data[i].Purchase_Code_Aos !== 'undefined'){
                mapPurchase.set(products[i].Purchase_Code_Aos, products[i].Name);  
            //}  
        }

        let query = '';
        for(let i = 0; i < req.query.days; i++){
            if(i>0) query += ' union ';
            query += `(select date(give_time) as day, product_id, count(*) as qty from w_iapdb.tbl_iap where give_complete = 2 and DATE(give_time) = DATE(DATE_SUB(now(), INTERVAL ${i} DAY)) GROUP BY product_id, date(give_time))`;
        }
        query += ';';

        sql.execute_iapdb(query).then(result => {
            //logger.debug(`----------------------------------------------------------------------------`);
            //logger.debug(`before get iapdb info : ${JSON.stringify(result)} length : ${result.length}`);
            for(let i=0; i<result.length; i++){
                let strName = mapPurchase.get(result[i].product_id);
                result[i].product_id = strName ?? result[i].product_id;
            }
            //logger.debug(`----------------------------------------------------------------------------`);
            //logger.debug(`before get iapdb info : ${JSON.stringify(result)} length : ${result.length}`);
            res.json({result:result});
        }).catch(err =>{
            logger.error(`in-app select error : ${err.message}`);
            res.json({message:err});
        });
    }).catch(err =>{
        logger.error(`in-app products select error : ${err.message}`);
        res.json({message:err});
    });
}

var update = function(req,res) {
}
