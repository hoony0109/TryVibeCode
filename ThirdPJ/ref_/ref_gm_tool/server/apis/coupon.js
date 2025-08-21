const config = require('../../config');
const logger = require('../libs/logger')(config.log.dir,config.log.name,config.log.level);
const dataManager = require('../libs/dataManager');

const sql = require('../models/mysql-db');

const { insertCrmLog } = require('../libs/logHelper'); // 공용 로그 함수 import


module.exports = function(app) {
    app.route('/api/coupon').get(select).post(update); 
    app.route('/api/coupon/used').get(selectUsed);
}

// 사용한 쿠폰 검색
var selectUsed = function(req, res) {
    const search_type = parseInt(req.query.search_type, 10);
    const strParam1 = req.query.strParam1;
    const intParam1 = BigInt(req.query.intParam1);

    // console.log(search_type);
    // console.log(strParam1);
    // console.log(intParam1);

    const queryWithOutParam = `CALL tsp_mmo_usercouponused_select_crm(?, ?, ?, @p_result); SELECT @p_result AS p_result;`;

    // 유저 닉네임으로 검색하는 경우 처리
    if (search_type === 4) {
        const worldIdx = intParam1;
        const nick = strParam1;

        const query = `SELECT user_idx FROM userinfo WHERE nick = ?`;
        
        sql.execute_gamedb(worldIdx, query, [nick])
            .then(result => {
                if (result.length > 0) {
                    const userIdx = result[0].user_idx;
                    
                    sql.execute_iapdb(queryWithOutParam, [3, strParam1, userIdx])
                        .then(result => handleProcedureResult(search_type, result, res))
                        .catch(err => handleError(err, res));
                } else {
                    throw new Error(`character(${nick}) does not exist`);
                    //res.json({ result: result });
                }
            })
            .catch(err => handleError(err, res));
    } else {
        // 일반적인 검색 처리
        sql.execute_iapdb(queryWithOutParam, [search_type, strParam1, intParam1])
            .then(result => handleProcedureResult(search_type, result, res))
            .catch(err => handleError(err, res));
    }
};

// 프로시저 결과 처리 함수
function handleProcedureResult(search_type, result, res) {
    // 프로시저 호출 시, 첫 번째 결과 세트를 추출
    const data = Array.isArray(result) && Array.isArray(result[0]) ? result[0] : result;
    const p_result = result[1] && result[1][0] && result[1][0].p_result;

    // console.log(data);
    // console.log(data.length);
    if (!Array.isArray(data) || data.length === 0) {
        if (0 === search_type) {
            res.json({ message: 'It has not been used yet.' });
        } else {
            res.json({ message: 'There is no record of coupon usage.' });
        }
    } else {
        res.json({ result: data });
    }
}

// 에러 처리 함수
function handleError(err, res) {
    logger.error(`account process error : ${err.message}`);
    res.json({ message: err.message });
}


// 쿠폰 목록 얻기
var select =  function(req,res) {
    //logger.debug('get request path:' + req.path + ' (query:' + Object.keys(req.query) + ' values:' + Object.values(req.query) + ')');
    /*
    let query = 'SELECT * FROM w_iapdb.user_coupon_type;';
    sql.execute_iapdb(query).then(result => {
        res.json({result:result});  
    }).catch(err =>{
        res.json({message:err});
    });
    */

    // 쿠폰 ID가 제공되었는지 확인
    if (req.query.couponID) {
        // 특정 쿠폰 조회 쿼리
        query = `SELECT coupon_id as coupon_code FROM w_iapdb.user_coupon WHERE coupon_type = ${req.query.couponID} ORDER BY coupon_id;`;
    } else {
        // 모든 쿠폰 목록 조회 쿼리
        //query = 'SELECT * FROM w_iapdb.user_coupon_type;';
        query = 'CALL tsp_mmo_usercoupon_select_crm();';
    }

    sql.execute_iapdb(query).then(result => {
/*
        if (result.length === 0) {
            res.json({message: 'No coupon found'});
        } else {
            res.json({result: result});
        }
*/
        // 프로시저 호출 시, 첫 번째 결과 세트를 추출
        const data = Array.isArray(result) && Array.isArray(result[0]) ? result[0] : result;

        if (data.length === 0) {
            res.json({ message: 'No coupon found' });
        } else {
            res.json({ result: data });
        }        

    }).catch(err => {
        res.json({message: err});
    });    
}

// 쿠폰 정보(설정 or 삭제),  실제 쿠폰번호 생성
var update = function(req,res) {
    logger.debug('post request path:' + req.path + ' (body:' + Object.keys(req.body)  + ' values:' + Object.values(req.body) + ')');

    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    let command = req.body.command;

    if(command === 'INSERT_COUPON'){
        // 쿠폰 설정
        if(typeof req.body.couponID === 'undefined' || typeof req.body.couponDesc === 'undefined' ||
            typeof req.body.couponCode === 'undefined' || typeof req.body.couponType === 'undefined' ||
            typeof req.body.couponStartTime === 'undefined' || typeof req.body.couponEndTime === 'undefined' ||
            typeof req.body.couponPostKeepDay === 'undefined' || typeof req.body.couponPostSender === 'undefined' ||
            typeof req.body.couponPostMsg === 'undefined' || typeof req.body.couponPostTextID === 'undefined' ||
            typeof req.body.couponRewardGold === 'undefined' || typeof req.body.couponRewardCashA === 'undefined' ||
            typeof req.body.couponRewardCashB === 'undefined' ||
            typeof req.body.itemID1 === 'undefined' || typeof req.body.itemValue1 === 'undefined' ||
            typeof req.body.itemID2 === 'undefined' || typeof req.body.itemValue2 === 'undefined' ||
            typeof req.body.itemID3 === 'undefined' || typeof req.body.itemValue3 === 'undefined' ||
            typeof req.body.itemID4 === 'undefined' || typeof req.body.itemValue4 === 'undefined' ||
            typeof req.body.itemID5 === 'undefined' || typeof req.body.itemValue5 === 'undefined' ||
            typeof req.body.itemID6 === 'undefined' || typeof req.body.itemValue6 === 'undefined' ||
            typeof req.body.itemID7 === 'undefined' || typeof req.body.itemValue7 === 'undefined' ||
            typeof req.body.itemID8 === 'undefined' || typeof req.body.itemValue8 === 'undefined' ||
            typeof req.body.itemID9 === 'undefined' || typeof req.body.itemValue9 === 'undefined' ||
            typeof req.body.itemID10 === 'undefined' || typeof req.body.itemValue10 === 'undefined' ||        
            typeof req.body.itemID11 === 'undefined' || typeof req.body.itemValue11 === 'undefined' ||
            typeof req.body.itemID12 === 'undefined' || typeof req.body.itemValue12 === 'undefined' ||
            typeof req.body.itemID13 === 'undefined' || typeof req.body.itemValue13 === 'undefined' ||
            typeof req.body.itemID14 === 'undefined' || typeof req.body.itemValue14 === 'undefined' ||
            typeof req.body.itemID15 === 'undefined' || typeof req.body.itemValue15 === 'undefined' ||
            typeof req.body.itemID16 === 'undefined' || typeof req.body.itemValue16 === 'undefined' ||
            typeof req.body.itemID17 === 'undefined' || typeof req.body.itemValue17 === 'undefined' ||
            typeof req.body.itemID18 === 'undefined' || typeof req.body.itemValue18 === 'undefined' ||
            typeof req.body.itemID19 === 'undefined' || typeof req.body.itemValue19 === 'undefined' ||
            typeof req.body.itemID20 === 'undefined' || typeof req.body.itemValue20 === 'undefined'){

            res.json({result:'request error'});
            return logger.error('request body error');
        }
        // 로그용
        let rewardLog = `(type_id:${req.body.couponID},coupon:${req.body.couponCode})`;
        if(0 < req.body.couponRewardGold){
            rewardLog += `(gold:${req.body.couponRewardGold})`;
        }
        if(0 < req.body.couponRewardCashA){
            rewardLog += `(casha:${req.body.couponRewardCashA})`;
        }
        if(0 < req.body.couponRewardCashB){
            rewardLog += `(cashb:${req.body.couponRewardCashB})`;
        }

        logger.error(`start : ${req.body.couponStartTime}`);
        logger.error(`end : ${req.body.couponEndTime}`);

        // 아이템 ID 및 타입을 저장할 객체
        let itemData = {};

        // Promise 배열
        let promises = [];

        // 아이템 ID를 반복하여 Promise를 생성하고 데이터를 수집
        for (let i = 1; i <= 20; i++) {
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
            let query = `insert into user_coupon_type (type_id, user_coupon_type.desc, use_type, post_sender_name, post_content, post_text_id, post_keep_day, start_time, expire_time,
                                                        reward_gold, reward_greenruby, reward_redruby, 
                                                        reward_item_1_type, reward_item_1_id, reward_item_1_qty, reward_item_2_type, reward_item_2_id, reward_item_2_qty,
                                                        reward_item_3_type, reward_item_3_id, reward_item_3_qty, reward_item_4_type, reward_item_4_id, reward_item_4_qty, 
                                                        reward_item_5_type, reward_item_5_id, reward_item_5_qty, reward_item_6_type, reward_item_6_id, reward_item_6_qty, 
                                                        reward_item_7_type, reward_item_7_id, reward_item_7_qty, reward_item_8_type, reward_item_8_id, reward_item_8_qty, 
                                                        reward_item_9_type, reward_item_9_id, reward_item_9_qty, reward_item_10_type, reward_item_10_id, reward_item_10_qty,
                                                        reward_item_11_type, reward_item_11_id, reward_item_11_qty, reward_item_12_type, reward_item_12_id, reward_item_12_qty,
                                                        reward_item_13_type, reward_item_13_id, reward_item_13_qty, reward_item_14_type, reward_item_14_id, reward_item_14_qty, 
                                                        reward_item_15_type, reward_item_15_id, reward_item_15_qty, reward_item_16_type, reward_item_16_id, reward_item_16_qty, 
                                                        reward_item_17_type, reward_item_17_id, reward_item_17_qty, reward_item_18_type, reward_item_18_id, reward_item_18_qty, 
                                                        reward_item_19_type, reward_item_19_id, reward_item_19_qty, reward_item_20_type, reward_item_20_id, reward_item_20_qty)
                                                VALUES (${req.body.couponID}, '${req.body.couponDesc}', ${req.body.couponType}, '${req.body.couponPostSender}', '${req.body.couponPostMsg}',
                                                    ${req.body.couponPostTextID}, ${req.body.couponPostKeepDay}, ${req.body.couponStartTime}, ${req.body.couponEndTime},
                                                    ${req.body.couponRewardGold}, ${req.body.couponRewardCashA}, ${req.body.couponRewardCashB},
                                                    ${itemData['itemType1']}, ${req.body.itemID1}, ${req.body.itemValue1}, ${itemData['itemType2']}, ${req.body.itemID2}, ${req.body.itemValue2}, 
                                                    ${itemData['itemType3']}, ${req.body.itemID3}, ${req.body.itemValue3}, ${itemData['itemType4']}, ${req.body.itemID4}, ${req.body.itemValue4}, 
                                                    ${itemData['itemType5']}, ${req.body.itemID5}, ${req.body.itemValue5}, ${itemData['itemType6']}, ${req.body.itemID6}, ${req.body.itemValue6}, 
                                                    ${itemData['itemType7']}, ${req.body.itemID7}, ${req.body.itemValue7}, ${itemData['itemType8']}, ${req.body.itemID8}, ${req.body.itemValue8}, 
                                                    ${itemData['itemType9']}, ${req.body.itemID9}, ${req.body.itemValue9}, ${itemData['itemType10']}, ${req.body.itemID10}, ${req.body.itemValue10},
                                                    ${itemData['itemType11']}, ${req.body.itemID11}, ${req.body.itemValue11}, ${itemData['itemType12']}, ${req.body.itemID12}, ${req.body.itemValue12}, 
                                                    ${itemData['itemType13']}, ${req.body.itemID13}, ${req.body.itemValue13}, ${itemData['itemType14']}, ${req.body.itemID14}, ${req.body.itemValue14}, 
                                                    ${itemData['itemType15']}, ${req.body.itemID15}, ${req.body.itemValue15}, ${itemData['itemType16']}, ${req.body.itemID16}, ${req.body.itemValue16}, 
                                                    ${itemData['itemType17']}, ${req.body.itemID17}, ${req.body.itemValue17}, ${itemData['itemType18']}, ${req.body.itemID18}, ${req.body.itemValue18}, 
                                                    ${itemData['itemType19']}, ${req.body.itemID19}, ${req.body.itemValue19}, ${itemData['itemType20']}, ${req.body.itemID20}, ${req.body.itemValue20});`;
            // 복수 쿠폰인 경우만 추가한다(단수쿠폰은 수량만큼 생성해야 한다)
            if(1 == req.body.couponType || 11 == req.body.couponType) {
                query += ` insert into user_coupon (coupon_id, coupon_type) VALUES ('${req.body.couponCode}', ${req.body.couponID});`;    
            }            
            sql.execute_iapdb(query).then(result => {
                logger.debug(`insert coupon : ${req.body.couponID}`);
                res.json({result:result});

                let message = command + ` => {${rewardLog}}`;  
                // c9soft-sp_log변경
                // query = `insert into tbl_log(ukey,idx,type,message) select ukey, ifnull(max(idx),-1)+1, 6, '${message}' FROM tbl_log where ukey=${req.body.ukey};`;
                // sql.execute_crmdb(query).then(result => {
                // }).catch(err =>{
                //     logger.error(`manager process error : ${err.message}`);
                // });
                insertCrmLog(req.body.ukey, clientIp, 6, command, message).then((result) => {
                }).catch(err => {
                    logger.error(`manager process error : ${err.message}`);
                });              

            }).catch(err =>{
                logger.error(`insert coupon process error : ${err.message}`);
                res.json({result:err});
            });            
        })
        .catch(err => {
            // 에러 처리
            logger.error(`insert coupon get data process error : ${err.message}`);
            res.json({result:err});            
        });

    }
    else if(command === 'UPDATE_COUPON'){
        // 쿠폰 설정
        if(typeof req.body.couponID === 'undefined' || typeof req.body.couponDesc === 'undefined' ||
            typeof req.body.couponCode === 'undefined' || typeof req.body.couponType === 'undefined' ||
            typeof req.body.couponStartTime === 'undefined' || typeof req.body.couponEndTime === 'undefined' ||
            typeof req.body.couponPostKeepDay === 'undefined' || typeof req.body.couponPostSender === 'undefined' ||
            typeof req.body.couponPostMsg === 'undefined' || typeof req.body.couponPostTextID === 'undefined' ||
            typeof req.body.couponRewardGold === 'undefined' || typeof req.body.couponRewardCashA === 'undefined' ||
            typeof req.body.couponRewardCashB === 'undefined' ||
            typeof req.body.itemID1 === 'undefined' || typeof req.body.itemValue1 === 'undefined' ||
            typeof req.body.itemID2 === 'undefined' || typeof req.body.itemValue2 === 'undefined' ||
            typeof req.body.itemID3 === 'undefined' || typeof req.body.itemValue3 === 'undefined' ||
            typeof req.body.itemID4 === 'undefined' || typeof req.body.itemValue4 === 'undefined' ||
            typeof req.body.itemID5 === 'undefined' || typeof req.body.itemValue5 === 'undefined' ||
            typeof req.body.itemID6 === 'undefined' || typeof req.body.itemValue6 === 'undefined' ||
            typeof req.body.itemID7 === 'undefined' || typeof req.body.itemValue7 === 'undefined' ||
            typeof req.body.itemID8 === 'undefined' || typeof req.body.itemValue8 === 'undefined' ||
            typeof req.body.itemID9 === 'undefined' || typeof req.body.itemValue9 === 'undefined' ||
            typeof req.body.itemID10 === 'undefined' || typeof req.body.itemValue10 === 'undefined' ||        
            typeof req.body.itemID11 === 'undefined' || typeof req.body.itemValue11 === 'undefined' ||
            typeof req.body.itemID12 === 'undefined' || typeof req.body.itemValue12 === 'undefined' ||
            typeof req.body.itemID13 === 'undefined' || typeof req.body.itemValue13 === 'undefined' ||
            typeof req.body.itemID14 === 'undefined' || typeof req.body.itemValue14 === 'undefined' ||
            typeof req.body.itemID15 === 'undefined' || typeof req.body.itemValue15 === 'undefined' ||
            typeof req.body.itemID16 === 'undefined' || typeof req.body.itemValue16 === 'undefined' ||
            typeof req.body.itemID17 === 'undefined' || typeof req.body.itemValue17 === 'undefined' ||
            typeof req.body.itemID18 === 'undefined' || typeof req.body.itemValue18 === 'undefined' ||
            typeof req.body.itemID19 === 'undefined' || typeof req.body.itemValue19 === 'undefined' ||
            typeof req.body.itemID20 === 'undefined' || typeof req.body.itemValue20 === 'undefined'){

            res.json({result:'request error'});
            return logger.error('request body error');
        }
        // 로그용
        let rewardLog = `(type_id:${req.body.couponID},coupon:${req.body.couponCode})`;
        if(0 < req.body.couponRewardGold){
            rewardLog += `(gold:${req.body.couponRewardGold})`;
        }
        if(0 < req.body.couponRewardCashA){
            rewardLog += `(casha:${req.body.couponRewardCashA})`;
        }
        if(0 < req.body.couponRewardCashB){
            rewardLog += `(cashb:${req.body.couponRewardCashB})`;
        }

        logger.error(`start : ${req.body.couponStartTime}`);
        logger.error(`end : ${req.body.couponEndTime}`);

        // 아이템 ID 및 타입을 저장할 객체
        let itemData = {};

        // Promise 배열
        let promises = [];

        // 아이템 ID를 반복하여 Promise를 생성하고 데이터를 수집
        for (let i = 1; i <= 20; i++) {
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

            // 복수쿠폰인 경우 먼저 삭제
            let query = `DELETE FROM user_coupon WHERE coupon_type = ${req.body.couponID} AND EXISTS (SELECT 1 FROM user_coupon_type WHERE type_id = ${req.body.couponID} AND (use_type = 1 OR use_type = 11));`;

            // 갱신하기
            query += `Update user_coupon_type set user_coupon_type.desc='${req.body.couponDesc}', use_type=${req.body.couponType}, post_sender_name='${req.body.couponPostSender}', 
                                                    post_content='${req.body.couponPostMsg}', post_text_id=${req.body.couponPostTextID}, post_keep_day=${req.body.couponPostKeepDay}, 
                                                    start_time=${req.body.couponStartTime}, expire_time=${req.body.couponEndTime},
                                                    reward_gold=${req.body.couponRewardGold}, reward_greenruby=${req.body.couponRewardCashA}, reward_redruby=${req.body.couponRewardCashB},
                                                    reward_item_1_type=${itemData['itemType1']}, reward_item_1_id=${req.body.itemID1}, reward_item_1_qty=${req.body.itemValue1}, 
                                                    reward_item_2_type=${itemData['itemType2']}, reward_item_2_id=${req.body.itemID2}, reward_item_2_qty=${req.body.itemValue2}, 
                                                    reward_item_3_type=${itemData['itemType3']}, reward_item_3_id=${req.body.itemID3}, reward_item_3_qty=${req.body.itemValue3}, 
                                                    reward_item_4_type=${itemData['itemType4']}, reward_item_4_id=${req.body.itemID4}, reward_item_4_qty=${req.body.itemValue4}, 
                                                    reward_item_5_type=${itemData['itemType5']}, reward_item_5_id=${req.body.itemID5}, reward_item_5_qty=${req.body.itemValue5}, 
                                                    reward_item_6_type=${itemData['itemType6']}, reward_item_6_id=${req.body.itemID6}, reward_item_6_qty=${req.body.itemValue6}, 
                                                    reward_item_7_type=${itemData['itemType7']}, reward_item_7_id=${req.body.itemID7}, reward_item_7_qty=${req.body.itemValue7}, 
                                                    reward_item_8_type=${itemData['itemType8']}, reward_item_8_id=${req.body.itemID8}, reward_item_8_qty=${req.body.itemValue8}, 
                                                    reward_item_9_type=${itemData['itemType9']}, reward_item_9_id=${req.body.itemID9}, reward_item_9_qty=${req.body.itemValue9}, 
                                                    reward_item_10_type=${itemData['itemType10']}, reward_item_10_id=${req.body.itemID10}, reward_item_10_qty=${req.body.itemValue10},
                                                    reward_item_11_type=${itemData['itemType11']}, reward_item_11_id=${req.body.itemID11}, reward_item_11_qty=${req.body.itemValue11}, 
                                                    reward_item_12_type=${itemData['itemType12']}, reward_item_12_id=${req.body.itemID12}, reward_item_12_qty=${req.body.itemValue12}, 
                                                    reward_item_13_type=${itemData['itemType13']}, reward_item_13_id=${req.body.itemID13}, reward_item_13_qty=${req.body.itemValue13}, 
                                                    reward_item_14_type=${itemData['itemType14']}, reward_item_14_id=${req.body.itemID14}, reward_item_14_qty=${req.body.itemValue14}, 
                                                    reward_item_15_type=${itemData['itemType15']}, reward_item_15_id=${req.body.itemID15}, reward_item_15_qty=${req.body.itemValue15}, 
                                                    reward_item_16_type=${itemData['itemType16']}, reward_item_16_id=${req.body.itemID16}, reward_item_16_qty=${req.body.itemValue16}, 
                                                    reward_item_17_type=${itemData['itemType17']}, reward_item_17_id=${req.body.itemID17}, reward_item_17_qty=${req.body.itemValue17}, 
                                                    reward_item_18_type=${itemData['itemType18']}, reward_item_18_id=${req.body.itemID18}, reward_item_18_qty=${req.body.itemValue18}, 
                                                    reward_item_19_type=${itemData['itemType19']}, reward_item_19_id=${req.body.itemID19}, reward_item_19_qty=${req.body.itemValue19}, 
                                                    reward_item_20_type=${itemData['itemType20']}, reward_item_20_id=${req.body.itemID20}, reward_item_20_qty=${req.body.itemValue20}
                        where type_id = ${req.body.couponID};`;
            // 복수 쿠폰인 경우만 추가한다(단수쿠폰은 수량만큼 생성해야 한다)
            if(1 == req.body.couponType || 11 == req.body.couponType) {
                query += ` insert into user_coupon (coupon_id, coupon_type) VALUES ('${req.body.couponCode}', ${req.body.couponID});`;    
            }
            sql.execute_iapdb(query).then(result => {
                logger.debug(`update coupon : ${req.body.couponID}`);
                res.json({result:result});

                let message = command + ` => {${rewardLog}}`;  
                // c9soft-sp_log변경
                // query = `insert into tbl_log(ukey,idx,type,message) select ukey, ifnull(max(idx),-1)+1, 6, '${message}' FROM tbl_log where ukey=${req.body.ukey};`;
                // sql.execute_crmdb(query).then(result => {
                // }).catch(err =>{
                //     logger.error(`manager process error : ${err.message}`);
                // });
                insertCrmLog(req.body.ukey, clientIp, 6, command, message).then((result) => {
                }).catch(err => {
                    logger.error(`manager process error : ${err.message}`);
                });                

            }).catch(err =>{
                logger.error(`update coupon process error : ${err.message}`);
                res.json({result:err});
            });            
        })
        .catch(err => {
            // 에러 처리
            logger.error(`update coupon get data process error : ${err.message}`);
            res.json({result:err});            
        });

    }    
    else if(command === 'MAKE_COUPON_CODE'){
        // 쿠폰 생성하기
        if(typeof req.body.type_id === 'undefined' || typeof req.body.make_qty === 'undefined'){
            res.json({result:'request error'});
            return logger.error('request body error');
        }

        let query = `call generate_coupon(${req.body.type_id}, ${req.body.make_qty});`;
        sql.execute_iapdb(query).then(result => {
            logger.debug(`make coupon code : ${req.body.type_id}`);
            res.json({result:result});

            let message = command + ` => {type_id:${req.body.type_id}, make_qty:${req.body.make_qty}}`;  
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
            logger.error(`make coupon process error : ${err.message} `);
            res.json({result:err});
        });        
    }
    else{
        // 쿠폰 삭제
        if(typeof req.body.type_id === 'undefined'){
            res.json({result:'request error'});
            return logger.error('request body error');
        }

        let query = `delete from user_coupon_type where type_id = ${req.body.type_id}; delete from user_coupon where coupon_type = ${req.body.type_id}`;
        sql.execute_iapdb(query).then(result => {
            logger.debug(`delete coupon type_id : ${req.body.type_id}`);
            res.json({result:result});

            let message = command + ` => {type_id:${req.body.type_id}}`;  
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
            logger.error(`delete coupon process error : ${err.message} `);
            res.json({result:err});
        });
    }
}