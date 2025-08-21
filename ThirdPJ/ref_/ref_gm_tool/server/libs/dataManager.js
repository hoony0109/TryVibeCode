const config = require('../../config');
const logger = require('./logger')(config.log.dir,config.log.name,config.log.level);

const cache = require('./cache');

// use local xml file
const xml2js = require('xml2js'), fs = require('fs');


// 캐쉬 데이터로 부터 모든 고정 리소스 데이터들을 얻는다
// 없으면 읽어서 데이터를 구축하고 그 데이터를 리턴
module.exports.getAllData = function(name) {
    return new Promise((resolve, reject) => {
        cache.instance().get(name,function(err,cacheData){
            if(err){
                // 캐쉬 데이터에서 읽을때 에러가 발생!
                //logger.error(`${nam} get fail from cache`);
                reject(null);
            }
            else if(typeof cacheData !== 'undefined' && cacheData !== null){
                // 캐쉬 데이터에 정보가 이미 있슴!
                // 캐쉬 데이터를 리턴한다
                //logger.debug(`${name} get caching data`);
                resolve(cacheData);
            }
            else {
                // 캐쉬 데이터에 정보가 없슴!
                // xml 파일로부터 데이터를 읽어 캐쉬에 적재하고 리턴
                //logger.debug(·${name} read xml start·);
                fs.readFile('./server/data/' + name + '.xml', function(err, xmlData) {
                    if(err){
                        //logger.error(`${name} get fail from local xml. error: ${err}`);
                        reject(null);
                    }
                    else {
                        //logger.debug(`${name} parse xml start`);
                        let parser = new xml2js.Parser();
                        parser.parseString(xmlData, function (err, dataRows) {
                            if(!err){
                                let cacheData = new Map();
                                for(let i=0; i<dataRows.Root.Data.length; i++){
                                    let data = dataRows.Root.Data[i].$;
                                    if(data.ID){
                                        //logger.debug(`${name}(ID:${data.ID}) set data row in cache data`);
                                        cacheData.set(data.ID,data);  
                                    }  
                                    else cacheData.set(i,data);        
                                }                               
    
                                let ttl = 0; // 0 is infinite or 600 is 600 secs.
                                cache.instance().set(name,cacheData,ttl,function (err, success) {
                                    if(err || !success) 
                                        logger.error(`${name} data set fail from cache`);
                                    else 
                                        logger.info(`${name} data cache(expire ttl: ${ttl} seconds)`);
                                        
                                    resolve(cacheData);
                                });
                            }
                            else{
                                logger.error(`${name} parsing fail from local xml. error:${err}`);
                                reject(null);
                            }
                        });
                    }
                });
            }
        });   
    });
}

module.exports.reloadAllData = function(name) {
    return new Promise((resolve, reject) => {
        // xml 파일로부터 데이터를 읽어 캐쉬에 적재하고 리턴
        //logger.debug(·${name} read xml start·);
        fs.readFile('./server/data/' + name + '.xml', function(err, xmlData) {
            if(err){
                //logger.error(`${name} get fail from local xml. error: ${err}`);
                reject(null);
            }
            else {
                //logger.debug(`${name} parse xml start`);
                let parser = new xml2js.Parser();
                parser.parseString(xmlData, function (err, dataRows) {
                    if(!err){
                        let cacheData = new Map();
                        for(let i=0; i<dataRows.Root.Data.length; i++){
                            let data = dataRows.Root.Data[i].$;
                            if(data.ID){
                                //logger.debug(`${name}(ID:${data.ID}) set data row in cache data`);
                                cacheData.set(data.ID,data);  
                            }  
                            else cacheData.set(i,data);        
                        }

                        let ttl = 0; // 0 is infinite or 600 is 600 secs.
                        cache.instance().set(name,cacheData,ttl,function (err, success) {
                            if(err || !success) 
                                logger.error(`${name} data set fail from cache`);
                            else 
                                logger.info(`${name} data cache(expire ttl: ${ttl} seconds)`);
                                
                            resolve(cacheData);
                        });
                    }
                    else{
                        logger.error(`${name} parsing fail from local xml. error:${err}`);
                        reject(null);
                    }
                });
            }
        });
    });
}

// 특정 리소스 데이터 얻기
module.exports.getData = function(name,idOrIds) {
    return new Promise((resolve, reject) => {
        if( !idOrIds  || typeof idOrIds === 'undefined') {
            logger.error(`${name} id is undefined`);
            reject (null);
        }
        this.getAllData(name).then(function(result) {
            if(!Array.isArray(idOrIds))
                resolve( result.get(idOrIds.toString()) );
            else{
                let results = new Array();
                for(let i=0; i<idOrIds.length; i++){
                    results.push( result.get(idOrIds[i].toString()) );
                }
                resolve( results );
            }
        }).catch(err => { 
            reject(null);
        });
    });
}

