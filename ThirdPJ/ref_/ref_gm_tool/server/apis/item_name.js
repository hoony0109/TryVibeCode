const config = require('../../config');
const logger = require('../libs/logger')(config.log.dir,config.log.name,config.log.level);

const dataManager = require('../libs/dataManager');

// api
// : 아이템 이름 목록 얻기
module.exports = function(app) {
    app.route('/api/item_name').get(select).post(select); 
}

var select =  function(req,res) {
    logger.debug(`get request path:${req.path} (query:${Object.keys(req.query)} values:${Object.values(req.values ?? '')})`);

    let itemNameData = new Array();
    dataManager.getAllData('Wealth_Name').then(result => {
        let data = Array.from(result.values());
        for(let i=0; i<data.length; i++){
            let name = '';
            if(config.language === 'kr')
                name = data[i].Name_KR;
            else if(config.language === 'cn')
                name = data[i].Name_CN;
            else if(config.language === 'vn')
                name =  data[i].Name_VN;
            else if(config.language === 'en')
                name =  data[i].Name_EN;
            else 
                name =  data[i].Name_Standard;

            itemNameData.push({ID:data[i].ID,Type:data[i].Type,Name:name});
        }
        dataManager.getAllData('Item_Name').then(result => {
            let data = Array.from(result.values());
            for(let i=0; i<data.length; i++){
                let name = '';
                if(config.language === 'kr')
                    name = data[i].Name_KR;
                else if(config.language === 'cn')
                    name = data[i].Name_CN;
                else if(config.language === 'vn')
                    name =  data[i].Name_VN;
                else if(config.language === 'en')
                    name =  data[i].Name_EN;
                else 
                    name =  data[i].Name_Standard;
            
                itemNameData.push({ID:data[i].ID,Type:data[i].Type,Name:name});
            }
            res.json({result:itemNameData});
        });
    });  
}