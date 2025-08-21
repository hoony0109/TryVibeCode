const config = require('../../config');
const logger = require('../libs/logger')(config.log.dir,config.log.name,config.log.level);

const dataManager = require('../libs/dataManager');

module.exports.setUserTitle = function(input,callback){       
    if(!input || input.length <=0) callback(input);

    //logger.debug('start title name input : ' + JSON.stringify(input));
    let output = new Array();
    for(let i=0; i<input.length; i++){    
        set(input[i],function(row){
            output.push(row);
            if(input.length === output.length){
                //logger.debug('finish title name output : ' + JSON.stringify(output));
                callback(output);
            }
        });
    }
    
    function set(row,callback){
        let name = '';
        if(typeof row.title_id !== 'undefined'){  
            dataManager.getData('Title_Name',row.title_id).then(data => {
                if(data) {
                    if(config.language === 'kr')
                        name = data.Name_KR;
                    else if(config.language === 'cn')
                        name = data.Name_CN;
                    else if(config.language === 'vn')
                        name =  data.Name_VN;
                    else if(config.language === 'en')
                        name =  data.Name_EN;
                    else 
                        name =  data.Name_Standard;
                }
                row['title_name'] = name;
                callback(row);
            }).catch(err => { 
                callback(row);
            });       
        }
        else callback(row);
    }
}

module.exports.setCharacterName = function(input,callback){       
    if(!input || input.length <=0) callback(input);

    //logger.debug('start title name input : ' + JSON.stringify(input));
    let output = new Array();
    for(let i=0; i<input.length; i++){    
        set(input[i],function(row){
            output.push(row);
            if(input.length === output.length){
                //logger.debug('finish title name output : ' + JSON.stringify(output));
                callback(output);
            }
        });
    }
    
    function set(row,callback){
        let name = '';
        if(typeof row.char_type !== 'undefined'){  
            dataManager.getData('Character_Name',row.char_type).then(data => {
                if(data) {
                    if(config.language === 'kr')
                        name = data.Name_KR;
                    else if(config.language === 'cn')
                        name = data.Name_CN;
                    else if(config.language === 'vn')
                        name =  data.Name_VN;
                    else if(config.language === 'en')
                        name =  data.Name_EN;
                    else 
                        name =  data.Name_Standard;
                }
                row['char_name'] = name;
                callback(row);
            }).catch(err => { 
                callback(row);
            });        
        }
        else callback(row);
    }
}

module.exports.setCharacterLevel = function(input,callback){       
    if(!input || input.length <=0) callback(input);

    //logger.debug('start title name input : ' + JSON.stringify(input));
    let output = new Array();
    for(let i=0; i<input.length; i++){    
        set(input[i],function(row){
            output.push(row);
            if(input.length === output.length){
                //logger.debug('finish title name output : ' + JSON.stringify(output));
                callback(output);
            }
        });
    }
    
    function set(row,callback){
        if(typeof row.char_type !== 'undefined'){  
            dataManager.getAllData('Level_Exp').then(data => {
                let levelData = Array.from(data.values());
                if(levelData) {
                    let charExp = Number(row.char_exp);
                    for(let i=0; i<levelData.length; i++){
                        if(Number(levelData[i].TotalExp)>charExp){
                            row['char_level'] = levelData[i].Level;
                            if(i>0) row['char_exp'] = charExp - Number(levelData[i-1].TotalExp);
                            return callback(row);
                        }
                    }
                    row['char_level'] = levelData[levelData.length-1].Level;
                    row['char_exp'] = levelData[levelData.length-1].NeedExp;
                    callback(row);
                }
                else callback(row);
            }).catch(err => { 
                callback(row);
            });      
        }
        else callback(row);
    }
}

module.exports.setSkillName = function(input,callback){       
    if(!input || input.length <=0) callback(input);

    //logger.debug('start title name input : ' + JSON.stringify(input));
    let output = new Array();
    for(let i=0; i<input.length; i++){    
        set(input[i],function(row){
            output.push(row);
            if(input.length === output.length){
                //logger.debug('finish title name output : ' + JSON.stringify(output));
                callback(output);
            }
        });
    }
    
    function set(row,callback){
        let name = '';
        if(typeof row.skill_id !== 'undefined'){  
            dataManager.getData('Skill_Name',row.skill_id).then(data => {
                if(data) {
                    if(config.language === 'kr')
                        name = data.Name_KR;
                    else if(config.language === 'cn')
                        name = data.Name_CN;
                    else if(config.language === 'vn')
                        name =  data.Name_VN;
                    else if(config.language === 'en')
                        name =  data.Name_EN;
                    else 
                        name =  data.Name_Standard;
                }
                row['skill_name'] = name;
                callback(row);
            }).catch(err => { 
                callback(row);
            });       
        }
        else callback(row);
    }
}

module.exports.setItemName = function(input,callback){       
    if(!input || input.length <=0) callback(input);

    let output = new Array();
    for(let i=0; i<input.length; i++){    
        set(input[i],function(row){
            output.push(row);
            if(input.length === output.length){
                //logger.debug('finish item name output : ' + JSON.stringify(output));
                callback(output);
            }
        });
    }
    
    function set(row,callback){
        let name = '';
        if(typeof row.item_id !== 'undefined'){  
            dataManager.getData('Wealth_Name',row.item_id).then(data => {
                if(data) {
                    if(config.language === 'kr')
                        name = data.Name_KR;
                    else if(config.language === 'cn')
                        name = data.Name_CN;
                    else if(config.language === 'vn')
                        name =  data.Name_VN;
                    else if(config.language === 'en')
                        name =  data.Name_EN;
                    else 
                        name =  data.Name_Standard;

                    row['item_name'] = name;
                    callback(row);
                } else {
                    dataManager.getData('Item_Name',row.item_id).then(data => {
                        if(data) {
                            if(config.language === 'kr')
                                name = data.Name_KR;
                            else if(config.language === 'cn')
                                name = data.Name_CN;
                            else if(config.language === 'vn')
                                name =  data.Name_VN;
                            else if(config.language === 'en')
                                name =  data.Name_EN;
                            else 
                                name =  data.Name_Standard;
                        }
                        row['item_name'] = name;
                        callback(row);
                    }).catch(err => { 
                        callback(row);
                    });
                }
            }).catch(err => { 
                callback(row);
            });  
        }
        else if(typeof row.item_idx !== 'undefined'){  
            dataManager.getData('Wealth_Name',row.item_idx).then(data => {
                if(data) {
                    if(config.language === 'kr')
                        name = data.Name_KR;
                    else if(config.language === 'cn')
                        name = data.Name_CN;
                    else if(config.language === 'vn')
                        name =  data.Name_VN;
                    else if(config.language === 'en')
                        name =  data.Name_EN;
                    else 
                        name =  data.Name_Standard;

                    row['item_name'] = name;
                    callback(row);
                } else {
                    dataManager.getData('Item_Name',row.item_idx).then(data => {
                        if(data) {
                            if(config.language === 'kr')
                                name = data.Name_KR;
                            else if(config.language === 'cn')
                                name = data.Name_CN;
                            else if(config.language === 'vn')
                                name =  data.Name_VN;
                            else if(config.language === 'en')
                                name =  data.Name_EN;
                            else 
                                name =  data.Name_Standard;
                        }
                        row['item_name'] = name;
                        callback(row);
                    }).catch(err => { 
                        callback(row);
                    });
                }
            }).catch(err => { 
                callback(row);
            });  
        }        
        else callback(row);
    }
}

