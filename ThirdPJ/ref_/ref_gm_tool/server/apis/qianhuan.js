const config = require('../../config');
const logger = require('../libs/logger')(config.log.dir,config.log.name,config.log.level);
const dataManager = require('../libs/dataManager');

const sql = require('../models/mysql-db');

const { insertCrmLog } = require('../libs/logHelper'); // 공용 로그 함수 import


module.exports = function(app) {
    app.route('/api/qianhuan/mail').get(select).post(update); 
}

// 메일 보상 정보 열기
var select =  function(req,res) {
    //logger.debug('get request path:' + req.path + ' (query:' + Object.keys(req.query) + ' values:' + Object.values(req.query) + ')');

    let query = 'SELECT * FROM w_iapdb.tbl_api_qianhuan_mail_info;';
    sql.execute_iapdb(query).then(result => {
        res.json({result:result});  
    }).catch(err =>{
        res.json({message:err});
    });
}

// 메일 보상 정보 추가/삭제/갱신
var update = function(req,res) {
    logger.debug('post request path:' + req.path + ' (body:' + Object.keys(req.body)  + ' values:' + Object.values(req.body) + ')');

    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    let command = req.body.command;

    if(command === 'QIANHUAN_INSERT_MAIL'){
        // 메일 보상 정보 추가
        if(typeof req.body.mailID === 'undefined' ||
            typeof req.body.itemID1 === 'undefined' || typeof req.body.itemValue1 === 'undefined' ||
            typeof req.body.itemID2 === 'undefined' || typeof req.body.itemValue2 === 'undefined' ||
            typeof req.body.itemID3 === 'undefined' || typeof req.body.itemValue3 === 'undefined' ||
            typeof req.body.itemID4 === 'undefined' || typeof req.body.itemValue4 === 'undefined' ||
            typeof req.body.itemID5 === 'undefined' || typeof req.body.itemValue5 === 'undefined' ||
            typeof req.body.itemID6 === 'undefined' || typeof req.body.itemValue6 === 'undefined' ||
            typeof req.body.itemID7 === 'undefined' || typeof req.body.itemValue7 === 'undefined' ||
            typeof req.body.itemID8 === 'undefined' || typeof req.body.itemValue8 === 'undefined' ||
            typeof req.body.itemID9 === 'undefined' || typeof req.body.itemValue9 === 'undefined' ||
            typeof req.body.itemID10 === 'undefined' || typeof req.body.itemValue10 === 'undefined'){

            res.json({result:'request error'});
            return logger.error('request body error');
        }
        // 로그용
        let rewardLog = `(mail_id:${req.body.mailID})`;

        // 아이템 ID 및 타입을 저장할 객체
        let itemData = {};

        // Promise 배열
        let promises = [];

        // 아이템 ID를 반복하여 Promise를 생성하고 데이터를 수집
        for (let i = 1; i <= 10; i++) {
            let itemID = req.body['itemID' + i];
            if (itemID > 0) {
                promises.push(
                    dataManager.getData('Item_Name', itemID).then(data => {
                        itemData['itemType' + i] = data ? Number(data.Type) : 0;
                    })
                );
                // 로그
                rewardLog += `(${itemID}, ${req.body['itemValue' + i]})`;
            }
            else {
                itemData['itemType' + i] = 0;
            }
        }

        Promise.all(promises)
        .then(() => {
            // 이곳은 모든 비동기 작업이 완료된 후 실행됩니다.
            let query = `insert into tbl_api_qianhuan_mail_info (mail_id, reward_item_1_type, reward_item_1_id, reward_item_1_qty,
                                                        reward_item_2_type, reward_item_2_id, reward_item_2_qty, reward_item_3_type, reward_item_3_id, reward_item_3_qty,
                                                        reward_item_4_type, reward_item_4_id, reward_item_4_qty, reward_item_5_type, reward_item_5_id, reward_item_5_qty,
                                                        reward_item_6_type, reward_item_6_id, reward_item_6_qty, reward_item_7_type, reward_item_7_id, reward_item_7_qty,
                                                        reward_item_8_type, reward_item_8_id, reward_item_8_qty, reward_item_9_type, reward_item_9_id, reward_item_9_qty,
                                                        reward_item_10_type, reward_item_10_id, reward_item_10_qty)
                                                VALUES (${req.body.mailID}, 
                                                    ${itemData['itemType1']}, ${req.body.itemID1}, ${req.body.itemValue1}, ${itemData['itemType2']}, ${req.body.itemID2}, ${req.body.itemValue2}, 
                                                    ${itemData['itemType3']}, ${req.body.itemID3}, ${req.body.itemValue3}, ${itemData['itemType4']}, ${req.body.itemID4}, ${req.body.itemValue4}, 
                                                    ${itemData['itemType5']}, ${req.body.itemID5}, ${req.body.itemValue5}, ${itemData['itemType6']}, ${req.body.itemID6}, ${req.body.itemValue6}, 
                                                    ${itemData['itemType7']}, ${req.body.itemID7}, ${req.body.itemValue7}, ${itemData['itemType8']}, ${req.body.itemID8}, ${req.body.itemValue8}, 
                                                    ${itemData['itemType9']}, ${req.body.itemID9}, ${req.body.itemValue9}, ${itemData['itemType10']}, ${req.body.itemID10}, ${req.body.itemValue10})`;
            sql.execute_iapdb(query).then(result => {
                logger.debug(`insert qianhuan_mail : ${req.body.mailID}`);
                res.json({result:result});

                let message = command + ` => {${rewardLog}}`;  
                // c9soft-sp_log변경
                // query = `insert into tbl_log(ukey,idx,type,message) select ukey, ifnull(max(idx),-1)+1, 6, \'${message}\' FROM tbl_log where ukey=${req.body.ukey};`;
                // sql.execute_crmdb(query).then(result => {
                // }).catch(err =>{
                //     logger.error(`manager process error : ${err.message}`);
                // });
                insertCrmLog(req.body.ukey, clientIp, 6, command, message).then((result) => {
                }).catch(err => {
                    logger.error(`manager process error : ${err.message}`);
                });
            }).catch(err =>{
                logger.error(`insert qianhuan_mail process error : ${err.message}`);
                res.json({result:err});
            });            
        })
        .catch(err => {
            // 에러 처리
            logger.error(`insert qianhuan_mail get data process error : ${err.message}`);
            res.json({result:err});            
        });
    }
    else if(command === 'QIANHUAN_UPDATE_MAIL'){
        // 메일 보상 정보 갱신
        if(typeof req.body.mailID === 'undefined' ||
            typeof req.body.itemID1 === 'undefined' || typeof req.body.itemValue1 === 'undefined' ||
            typeof req.body.itemID2 === 'undefined' || typeof req.body.itemValue2 === 'undefined' ||
            typeof req.body.itemID3 === 'undefined' || typeof req.body.itemValue3 === 'undefined' ||
            typeof req.body.itemID4 === 'undefined' || typeof req.body.itemValue4 === 'undefined' ||
            typeof req.body.itemID5 === 'undefined' || typeof req.body.itemValue5 === 'undefined' ||
            typeof req.body.itemID6 === 'undefined' || typeof req.body.itemValue6 === 'undefined' ||
            typeof req.body.itemID7 === 'undefined' || typeof req.body.itemValue7 === 'undefined' ||
            typeof req.body.itemID8 === 'undefined' || typeof req.body.itemValue8 === 'undefined' ||
            typeof req.body.itemID9 === 'undefined' || typeof req.body.itemValue9 === 'undefined' ||
            typeof req.body.itemID10 === 'undefined' || typeof req.body.itemValue10 === 'undefined'){

            res.json({result:'request error'});
            return logger.error('request body error');
        }
        // 로그용
        let rewardLog = `(mail_id:${req.body.mailID})`;

        // 아이템 ID 및 타입을 저장할 객체
        let itemData = {};

        // Promise 배열
        let promises = [];

        // 아이템 ID를 반복하여 Promise를 생성하고 데이터를 수집
        for (let i = 1; i <= 10; i++) {
            let itemID = req.body['itemID' + i];
            if (itemID > 0) {
                promises.push(
                    dataManager.getData('Item_Name', itemID).then(data => {
                        itemData['itemType' + i] = data ? Number(data.Type) : 0;
                    })
                );
                // 로그
                rewardLog += `(${itemID}, ${req.body['itemValue' + i]})`;
            }
            else {
                itemData['itemType' + i] = 0;
            }
        }

        Promise.all(promises)
        .then(() => {
            // 이곳은 모든 비동기 작업이 완료된 후 실행됩니다.
            let query = `update tbl_api_qianhuan_mail_info set  
                                                    reward_item_1_type=${itemData['itemType1']}, reward_item_1_id=${req.body.itemID1}, reward_item_1_qty=${req.body.itemValue1}, 
                                                    reward_item_2_type=${itemData['itemType2']}, reward_item_2_id=${req.body.itemID2}, reward_item_2_qty=${req.body.itemValue2}, 
                                                    reward_item_3_type=${itemData['itemType3']}, reward_item_3_id=${req.body.itemID3}, reward_item_3_qty=${req.body.itemValue3}, 
                                                    reward_item_4_type=${itemData['itemType4']}, reward_item_4_id=${req.body.itemID4}, reward_item_4_qty=${req.body.itemValue4}, 
                                                    reward_item_5_type=${itemData['itemType5']}, reward_item_5_id=${req.body.itemID5}, reward_item_5_qty=${req.body.itemValue5}, 
                                                    reward_item_6_type=${itemData['itemType6']}, reward_item_6_id=${req.body.itemID6}, reward_item_6_qty=${req.body.itemValue6}, 
                                                    reward_item_7_type=${itemData['itemType7']}, reward_item_7_id=${req.body.itemID7}, reward_item_7_qty=${req.body.itemValue7}, 
                                                    reward_item_8_type=${itemData['itemType8']}, reward_item_8_id=${req.body.itemID8}, reward_item_8_qty=${req.body.itemValue8}, 
                                                    reward_item_9_type=${itemData['itemType9']}, reward_item_9_id=${req.body.itemID9}, reward_item_9_qty=${req.body.itemValue9}, 
                                                    reward_item_10_type=${itemData['itemType10']}, reward_item_10_id=${req.body.itemID10}, reward_item_10_qty=${req.body.itemValue10} 
                            where mail_id = ${req.body.mailID}`;
            sql.execute_iapdb(query).then(result => {
                logger.debug(`update qianhuan_mail : ${req.body.mailID}`);
                res.json({result:result});

                let message = command + ` => {${rewardLog}}`; 
                // c9soft-sp_log변경 
                // query = `insert into tbl_log(ukey,idx,type,message) select ukey, ifnull(max(idx),-1)+1, 6, \'${message}\' FROM tbl_log where ukey=${req.body.ukey};`;
                // sql.execute_crmdb(query).then(result => {
                // }).catch(err =>{
                //     logger.error(`manager process error : ${err.message}`);
                // });
                insertCrmLog(req.body.ukey, clientIp, 6, command, message).then((result) => {
                }).catch(err => {
                    logger.error(`manager process error : ${err.message}`);
                });
            }).catch(err =>{
                logger.error(`update qianhuan_mail process error : ${err.message}`);
                res.json({result:err});
            });            
        })
        .catch(err => {
            // 에러 처리
            logger.error(`insert qianhuan_mail get data process error : ${err.message}`);
            res.json({result:err});            
        });        
    }
    else{
        // 정보 삭제
        if(typeof req.body.mail_id === 'undefined'){
            res.json({result:'request error'});
            return logger.error('request body error');
        }

        let query = `delete from tbl_api_qianhuan_mail_info where mail_id = ${req.body.mail_id};`;
        sql.execute_iapdb(query).then(result => {
            logger.debug(`delete qianhuan_mail mail_id : ${req.body.mail_id}`);
            res.json({result:result});

            let message = command + ` => {mail_id:${req.body.mail_id}}`;  
            // c9soft-sp_log변경
            // query = `insert into tbl_log(ukey,idx,type,message) select ukey, ifnull(max(idx),-1)+1, 6, \'${message}\' FROM tbl_log where ukey=${req.body.ukey};`;
            // sql.execute_crmdb(query).then(result => {
            // }).catch(err =>{
            //     logger.error(`manager process error : ${err.message}`);
            // });
            insertCrmLog(req.body.ukey, clientIp, 6, command, message).then((result) => {
            }).catch(err => {
                logger.error(`manager process error : ${err.message}`);
            });
        }).catch(err =>{
            logger.error(`delete qianhuan_mail process error : ${err.message} `);
            res.json({result:err});
        });
    }
}