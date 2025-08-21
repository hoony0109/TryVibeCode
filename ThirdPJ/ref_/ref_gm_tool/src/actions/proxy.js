const axios = require('axios');

// data ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.getItemName = function() {
    return new Promise((resolve, reject) => {
        axios.get('/api/item_name').then( response =>{
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    });
}

exports.getWorldName = function(){
    return new Promise((resolve, reject) => {
        axios.get('/api/world_name').then( response =>{
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    });
}

// login ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.login = function(id,pwd){
    return new Promise((resolve, reject) => {
        axios.get('/api/login',{params:{id:id,pwd:pwd}}).then( response =>{
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    });
}

// user ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.getAccount = function(ukey,accountId) {
    return new Promise((resolve, reject) => {
        axios.get('/api/account',{params:{ukey:ukey,accountId:accountId}}).then( response =>{
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    });
}

exports.getAccountByGameAccountID = function(ukey,gameAccountID){
    return new Promise((resolve, reject) => {
        axios.get('/api/account',{params:{ukey:ukey,gameAccountID:gameAccountID}}).then( response =>{
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    });
}

exports.getAccountByGameUserId = function(ukey,gameUserId){
    return new Promise((resolve, reject) => {
        axios.get('/api/account',{params:{ukey:ukey,gameUserId:gameUserId}}).then( response =>{
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    });
}

exports.getAccountByWorldnNick = function(ukey,worldIdx,characterNick){
    return new Promise((resolve, reject) => {
        axios.get('/api/account',{params:{ukey:ukey,worldIdx:worldIdx,characterNick:characterNick}}).then( response =>{
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    });
}

exports.setAccount = function(ukey,command,accountIdx,blockHours=0,blockReason='') {
    return new Promise((resolve, reject) => {
        axios.post('/api/account',{ukey:ukey,command:command,accountIdx:accountIdx,blockHours:blockHours,blockReason:blockReason}).then( response =>{
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    });
}

exports.getUser = function(ukey,worldIdx,userIdx) {
    return new Promise((resolve, reject) => {
        axios.get('/api/user',{params:{ukey:ukey,worldIdx:worldIdx,userIdx:userIdx}}).then( response =>{
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    });
}

exports.getUserTitle = function(ukey,worldIdx,userIdx) {
    return new Promise((resolve, reject) => {
        axios.get('/api/user_title',{params:{ukey:ukey,worldIdx:worldIdx,userIdx:userIdx}}).then( response =>{
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    });
}

exports.getUserChatBlock = function(ukey,worldIdx,userIdx) {
    return new Promise((resolve, reject) => {
        axios.get('/api/user_chat_block',{params:{ukey:ukey,worldIdx:worldIdx,userIdx:userIdx}}).then( response =>{
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    });
}

exports.setUserChatBlock = function(ukey,command,worldIdx,userIdx,blockMins,blockReason) {
    return new Promise((resolve, reject) => {
        axios.post('/api/user_chat_block', {ukey:ukey,command:command,worldIdx:worldIdx,userIdx:userIdx,blockMins:blockMins,blockReason:blockReason}).then( response => {
            resolve(response.data);
          }).catch(err => {
            reject(err);
          });
    });
}

exports.getUserPost = function(ukey,worldIdx,userIdx,page) {
    return new Promise((resolve, reject) => {
        axios.get('/api/user_post',{params:{ukey:ukey,worldIdx:worldIdx,userIdx:userIdx,page:page}}).then( response =>{
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    });
}

exports.setUserPost = function(ukey,command,worldIdx,userIdx,senderNickname,msg,expireDays,attachedItem,attachedItemValue) {
    return new Promise((resolve, reject) => {
        axios.post('/api/user_post', { ukey:ukey,command:command,worldIdx:worldIdx,userIdx:userIdx,senderNickname:senderNickname,msg:msg,expireDays:expireDays,attachedItem:attachedItem,attachedItemValue:attachedItemValue}).then( response => {
            resolve(response.data);
          }).catch(err => {
            reject(err);
          });
    });
}

exports.deleteUserPost = function(ukey,command,worldIdx,postIdx,userIdx) {
    return new Promise((resolve, reject) => {
        axios.post('/api/user_post', { ukey:ukey,command:command,worldIdx:worldIdx,postIdx:postIdx,userIdx:userIdx}).then( response => {
            resolve(response.data);
          }).catch(err => {
            reject(err);
          });
    });
}

exports.getUserIAP = function(ukey,worldIdx,userIdx) {
    return new Promise((resolve, reject) => {
        axios.get('/api/user_iap',{params:{ukey:ukey,worldIdx:worldIdx,userIdx:userIdx}}).then( response =>{
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    });
}

exports.setUserIAPGiveComplete = function(ukey,command,worldIdx,userIdx,txid,giveComplete) {
    return new Promise((resolve, reject) => {
        axios.post('/api/user_iap', {ukey:ukey,command:command,worldIdx:worldIdx,userIdx:userIdx,txid:txid,giveComplete:giveComplete}).then( response => {
            resolve(response.data);
          }).catch(err => {
            reject(err);
          });
    });
}

exports.geUserCombat = function(ukey,worldIdx,userIdx) {
    return new Promise((resolve, reject) => {
        axios.get('/api/user_combat',{params:{ukey:ukey,worldIdx:worldIdx,userIdx:userIdx}}).then( response =>{
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    });
}

exports.getUserCombatRivals = function(ukey,worldIdx,userIdx) {
    return new Promise((resolve, reject) => {
        axios.get('/api/user_combat_rivals',{params:{ukey:ukey,worldIdx:worldIdx,userIdx:userIdx}}).then( response =>{
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    });
}

exports.getCharacter = function(ukey,worldIdx,userIdx) {
    return new Promise((resolve, reject) => {
        axios.get('/api/character',{params:{ukey:ukey,worldIdx:worldIdx,userIdx:userIdx}}).then( response =>{
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    });
}

exports.setCharacterPos = function(ukey,command,worldIdx,userIdx,characterIdx,posX,posZ,stage) {
    return new Promise((resolve, reject) => {
        axios.post('/api/character', {ukey:ukey,command:command,worldIdx:worldIdx,userIdx:userIdx,characterIdx:characterIdx,posX:posX,posZ:posZ,stage:stage}).then( response => {
            resolve(response.data);
          }).catch(err => {
            reject(err);
          });
    });
}

exports.getCharacterBag = function(ukey,worldIdx,userIdx,characterIdx) {
    return new Promise((resolve, reject) => {
        axios.get('/api/character_bag',{params:{ukey:ukey,worldIdx:worldIdx,userIdx:userIdx,characterIdx:characterIdx}}).then( response =>{
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    });
}

exports.getCharacterEquip = function(ukey,worldIdx,userIdx,characterIdx) {
    return new Promise((resolve, reject) => {
        axios.get('/api/character_equip',{params:{ukey:ukey,worldIdx:worldIdx,userIdx:userIdx,characterIdx:characterIdx}}).then( response =>{
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    });
}

exports.getCharacterItem = function(ukey,worldIdx,userIdx,characterIdx) {
    return new Promise((resolve, reject) => {
        axios.get('/api/character_item',{params:{ukey:ukey,worldIdx:worldIdx,userIdx:userIdx,characterIdx:characterIdx}}).then( response =>{
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    });
}

exports.getCharacterSkill = function(ukey,worldIdx,userIdx,characterIdx) {
    return new Promise((resolve, reject) => {
        axios.get('/api/character_skill',{params:{ukey:ukey,worldIdx:worldIdx,userIdx:userIdx,characterIdx:characterIdx}}).then( response =>{
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    });
}

exports.getCharacterSkillbook = function(ukey,worldIdx,userIdx,characterIdx) {
    return new Promise((resolve, reject) => {
        axios.get('/api/character_skillbook',{params:{ukey:ukey,worldIdx:worldIdx,userIdx:userIdx,characterIdx:characterIdx}}).then( response =>{
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    });
}

exports.getCharacterBeads = function(ukey,worldIdx,userIdx,characterIdx) {
    return new Promise((resolve, reject) => {
        axios.get('/api/character_beads',{params:{ukey:ukey,worldIdx:worldIdx,userIdx:userIdx,characterIdx:characterIdx}}).then( response =>{
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    });
}

exports.getCharacterVehicle = function(ukey,worldIdx,userIdx,characterIdx) {
    return new Promise((resolve, reject) => {
        axios.get('/api/character_vehicle',{params:{ukey:ukey,worldIdx:worldIdx,userIdx:userIdx,characterIdx:characterIdx}}).then( response =>{
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    });
}

exports.getCharacterVehicleAccessory = function(ukey,worldIdx,userIdx,characterIdx) {
    return new Promise((resolve, reject) => {
        axios.get('/api/character_vehicle_accessory',{params:{ukey:ukey,worldIdx:worldIdx,userIdx:userIdx,characterIdx:characterIdx}}).then( response =>{
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    });
}

exports.getCharacterQuest = function(ukey,worldIdx,userIdx,characterIdx) {
    return new Promise((resolve, reject) => {
        axios.get('/api/character_quest',{params:{ukey:ukey,worldIdx:worldIdx,userIdx:userIdx,characterIdx:characterIdx}}).then( response =>{
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    });
}

exports.getCharacterQuestClear = function(ukey,worldIdx,userIdx,characterIdx) {
    return new Promise((resolve, reject) => {
        axios.get('/api/character_quest_clear',{params:{ukey:ukey,worldIdx:worldIdx,userIdx:userIdx,characterIdx:characterIdx}}).then( response =>{
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    });
}

exports.getCharacterQuestScroll = function(ukey,worldIdx,userIdx,characterIdx) {
    return new Promise((resolve, reject) => {
        axios.get('/api/character_quest_scroll',{params:{ukey:ukey,worldIdx:worldIdx,userIdx:userIdx,characterIdx:characterIdx}}).then( response =>{
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    });
}

exports.getCharacterStageSeal = function(ukey,worldIdx,userIdx,characterIdx) {
    return new Promise((resolve, reject) => {
        axios.get('/api/character_stage_seal',{params:{ukey:ukey,worldIdx:worldIdx,userIdx:userIdx,characterIdx:characterIdx}}).then( response =>{
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    });
}

exports.getCharacterStageGrowth = function(ukey,worldIdx,userIdx,characterIdx) {
    return new Promise((resolve, reject) => {
        axios.get('/api/character_stage_growth',{params:{ukey:ukey,worldIdx:worldIdx,userIdx:userIdx,characterIdx:characterIdx}}).then( response =>{
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    });
}

// cs ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.setPost = function(ukey,command,senderNickname,msg,expireDays,attachedItem,attachedItemValue) {
    return new Promise((resolve, reject) => {
        axios.post('/api/post', { ukey:ukey,command:command,senderNickname:senderNickname,msg:msg,expireDays:expireDays,attachedItem:attachedItem,attachedItemValue:attachedItemValue}).then( response => {
            resolve(response.data);
          }).catch(err => {
            reject(err);
          });
    });
}

exports.getNotice = function(ukey){
    return new Promise((resolve, reject) => {
        axios.get('/api/notice',{params:{ukey:ukey}}).then( response =>{
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    });
}

exports.setNotice = function(ukey,command,woridIdx,msg,starttime,term,count) {
    return new Promise((resolve, reject) => {
        axios.post('/api/notice', { ukey:ukey,command:command,woridIdx:woridIdx,msg:msg,starttime:starttime,term:term,count:count}).then( response => {
            resolve(response.data);
          }).catch(err => {
            reject(err);
          });
    });
}

exports.deleteNotice = function(ukey,command,senderUkey,idx) {
    return new Promise((resolve, reject) => {
        axios.post('/api/notice', { ukey:ukey,command:command,senderUkey,idx }).then( response => {
            resolve(response.data);
          }).catch(err => {
            reject(err);
          });
    });
}

exports.getIpBlock = function(ukey) {
    return new Promise((resolve, reject) => {
        axios.get('/api/ip_block',{params:{ukey:ukey}}).then( response =>{
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    });
}

exports.setIpBlock= function(ukey,command,ip,blockHours,blockReason) {
    return new Promise((resolve, reject) => {
        axios.post('/api/ip_block', { ukey:ukey,command:command,ip:ip,blockHours:blockHours,blockReason:blockReason}).then( response => {
            resolve(response.data);
          }).catch(err => {
            reject(err);
          });
    });
}

exports.getServerState = function(ukey) {
    return new Promise((resolve, reject) => {
        axios.get('/api/server_state',{params:{ukey:ukey}}).then( response =>{
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    });
}

exports.setServerState = function(ukey,command,starttime,endtime) {
    return new Promise((resolve, reject) => {
        axios.post('/api/server_state',{ukey:ukey,command:command,starttime:starttime,endtime:endtime}).then( response =>{
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    });
}

exports.getClientVersion = function(ukey) {
    return new Promise((resolve, reject) => {
        axios.get('/api/client_version',{params:{ukey:ukey}}).then( response =>{
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    });
}

exports.setClientVersion = function(ukey,command,clientVersion) {
    return new Promise((resolve, reject) => {
        axios.post('/api/client_version',{ukey:ukey,command:command,clientVersion:clientVersion}).then( response =>{
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    });
}

exports.sendItems = function(ukey,command,batchData) {
    return new Promise((resolve, reject) => {
        axios.post('/api/sendItems',{ukey:ukey,command:command,batchData:JSON.stringify(batchData)}).then( response =>{
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    });
}

// 쿠폰 정보 목록 얻기
exports.getCouponInfo = function(ukey){
    return new Promise((resolve, reject) => {
        axios.get('/api/coupon',{params:{ukey:ukey}}).then( response =>{
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    });
}

exports.insertCouponInfo = function(ukey,command, couponID,couponDesc,couponCode,couponType,couponStartTime,couponEndTime,
                                couponPostKeepDay,couponPostSender,couponPostMsg,couponPostTextID,
                                couponRewardGold,couponRewardCashA,couponRewardCashB,
                                itemID1,itemValue1,itemID2,itemValue2,itemID3,itemValue3,itemID4,itemValue4,itemID5,itemValue5,
                                itemID6,itemValue6,itemID7,itemValue7,itemID8,itemValue8,itemID9,itemValue9,itemID10,itemValue10,
                                itemID11,itemValue11,itemID12,itemValue12,itemID13,itemValue13,itemID14,itemValue14,itemID15,itemValue15,
                                itemID16,itemValue16,itemID17,itemValue17,itemID18,itemValue18,itemID19,itemValue19,itemID20,itemValue20) {
    return new Promise((resolve, reject) => {
        axios.post('/api/coupon', { ukey:ukey,command:command,couponID:couponID,couponDesc:couponDesc,
            couponCode:couponCode,couponType:couponType,couponStartTime:couponStartTime,couponEndTime:couponEndTime,
            couponPostKeepDay:couponPostKeepDay,couponPostSender:couponPostSender,couponPostMsg:couponPostMsg,couponPostTextID:couponPostTextID,
            couponRewardGold:couponRewardGold,couponRewardCashA:couponRewardCashA,couponRewardCashB:couponRewardCashB,
            itemID1:itemID1,itemValue1:itemValue1,itemID2:itemID2,itemValue2:itemValue2,itemID3:itemID3,itemValue3:itemValue3,
            itemID4:itemID4,itemValue4:itemValue4,itemID5:itemID5,itemValue5:itemValue5,
            itemID6:itemID6,itemValue6:itemValue6,itemID7:itemID7,itemValue7:itemValue7,itemID8:itemID8,itemValue8:itemValue8,
            itemID9:itemID9,itemValue9:itemValue9,itemID10:itemID10,itemValue10:itemValue10,
            itemID11:itemID11,itemValue11:itemValue11,itemID12:itemID12,itemValue12:itemValue12,itemID13:itemID13,itemValue13:itemValue13,
            itemID14:itemID14,itemValue14:itemValue14,itemID15:itemID15,itemValue15:itemValue15,
            itemID16:itemID16,itemValue16:itemValue16,itemID17:itemID17,itemValue17:itemValue17,itemID18:itemID18,itemValue18:itemValue18,
            itemID19:itemID19,itemValue19:itemValue19,itemID20:itemID20,itemValue20:itemValue20}).then( response => {
            resolve(response.data);
          }).catch(err => {
            reject(err);
          });
    });
}

exports.updateCouponInfo = function(ukey,command, couponID,couponDesc,couponCode,couponType,couponStartTime,couponEndTime,
                                couponPostKeepDay,couponPostSender,couponPostMsg,couponPostTextID,
                                couponRewardGold,couponRewardCashA,couponRewardCashB,
                                itemID1,itemValue1,itemID2,itemValue2,itemID3,itemValue3,itemID4,itemValue4,itemID5,itemValue5,
                                itemID6,itemValue6,itemID7,itemValue7,itemID8,itemValue8,itemID9,itemValue9,itemID10,itemValue10,
                                itemID11,itemValue11,itemID12,itemValue12,itemID13,itemValue13,itemID14,itemValue14,itemID15,itemValue15,
                                itemID16,itemValue16,itemID17,itemValue17,itemID18,itemValue18,itemID19,itemValue19,itemID20,itemValue20) {
    return new Promise((resolve, reject) => {
        axios.post('/api/coupon', { ukey:ukey,command:command,couponID:couponID,couponDesc:couponDesc,
            couponCode:couponCode,couponType:couponType,couponStartTime:couponStartTime,couponEndTime:couponEndTime,
            couponPostKeepDay:couponPostKeepDay,couponPostSender:couponPostSender,couponPostMsg:couponPostMsg,couponPostTextID:couponPostTextID,
            couponRewardGold:couponRewardGold,couponRewardCashA:couponRewardCashA,couponRewardCashB:couponRewardCashB,
            itemID1:itemID1,itemValue1:itemValue1,itemID2:itemID2,itemValue2:itemValue2,itemID3:itemID3,itemValue3:itemValue3,
            itemID4:itemID4,itemValue4:itemValue4,itemID5:itemID5,itemValue5:itemValue5,
            itemID6:itemID6,itemValue6:itemValue6,itemID7:itemID7,itemValue7:itemValue7,itemID8:itemID8,itemValue8:itemValue8,
            itemID9:itemID9,itemValue9:itemValue9,itemID10:itemID10,itemValue10:itemValue10,
            itemID11:itemID11,itemValue11:itemValue11,itemID12:itemID12,itemValue12:itemValue12,itemID13:itemID13,itemValue13:itemValue13,
            itemID14:itemID14,itemValue14:itemValue14,itemID15:itemID15,itemValue15:itemValue15,
            itemID16:itemID16,itemValue16:itemValue16,itemID17:itemID17,itemValue17:itemValue17,itemID18:itemID18,itemValue18:itemValue18,
            itemID19:itemID19,itemValue19:itemValue19,itemID20:itemID20,itemValue20:itemValue20}).then( response => {
            resolve(response.data);
          }).catch(err => {
            reject(err);
          });
    });
}

exports.deleteCouponInfo = function(ukey,command,type_id) {
    return new Promise((resolve, reject) => {
        axios.post('/api/coupon', { ukey:ukey,command:command,type_id}).then( response => {
            resolve(response.data);
          }).catch(err => {
            reject(err);
          });
    });
}

// command:MAKE_COUPON_CODE
exports.makeCoupon = function(ukey,command,type_id,make_qty) {
    return new Promise((resolve, reject) => {
        axios.post('/api/coupon', { ukey:ukey,command:command,type_id, make_qty}).then( response => {
            resolve(response.data);
          }).catch(err => {
            reject(err);
          });
    });
}

// 특정 ID를 가진 실제 쿠폰 리스트 얻기
exports.getCouponListByID = function(ukey, couponID) {
    return new Promise((resolve, reject) => {
        axios.get('/api/coupon', { params: { ukey: ukey, couponID: couponID } })
        .then(response => {
            resolve(response.data);
        })
        .catch(err => {
            reject(err);
        });
    });
}

// 사용된 쿠폰 조회
// 0:쿠폰코드, 1:플랫폼아이디, 2:게임계정아이디, 3:게임유저아이디, 4:캐릭터
exports.getUsedCouponInfo = function(ukey, search_type, strParam1, intParam1 ) {
    return new Promise((resolve, reject) => {
        axios.get('/api/coupon/used', { params: { ukey: ukey, search_type: search_type, strParam1: strParam1, intParam1: intParam1} })
        .then(response => {
            resolve(response.data);
        })
        .catch(err => {
            reject(err);
        });
    });
}

// _QIANHUAN_MAIL
exports.getQianhuanMail = function(ukey){
    return new Promise((resolve, reject) => {
        axios.get('/api/qianhuan/mail',{params:{ukey:ukey}}).then( response =>{
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    });
}
exports.setQianhuanMail = function(ukey,command, mailID,
                                itemID1,itemValue1,itemID2,itemValue2,itemID3,itemValue3,itemID4,itemValue4,itemID5,itemValue5,
                                itemID6,itemValue6,itemID7,itemValue7,itemID8,itemValue8,itemID9,itemValue9,itemID10,itemValue10) {
    return new Promise((resolve, reject) => {
        axios.post('/api/qianhuan/mail', { ukey:ukey,command:command,mailID:mailID,
            itemID1:itemID1,itemValue1:itemValue1,itemID2:itemID2,itemValue2:itemValue2,itemID3:itemID3,itemValue3:itemValue3,
            itemID4:itemID4,itemValue4:itemValue4,itemID5:itemID5,itemValue5:itemValue5,
            itemID6:itemID6,itemValue6:itemValue6,itemID7:itemID7,itemValue7:itemValue7,itemID8:itemID8,itemValue8:itemValue8,
            itemID9:itemID9,itemValue9:itemValue9,itemID10:itemID10,itemValue10:itemValue10}).then( response => {
            resolve(response.data);
          }).catch(err => {
            reject(err);
          });
    });
}

exports.deleteQianhuanMail = function(ukey,command,mail_id) {
    return new Promise((resolve, reject) => {
        axios.post('/api/qianhuan/mail', { ukey:ukey,command:command,mail_id}).then( response => {
            resolve(response.data);
          }).catch(err => {
            reject(err);
          });
    });
}

exports.updateQianhuanMail = function(ukey,command, mailID,
                                itemID1,itemValue1,itemID2,itemValue2,itemID3,itemValue3,itemID4,itemValue4,itemID5,itemValue5,
                                itemID6,itemValue6,itemID7,itemValue7,itemID8,itemValue8,itemID9,itemValue9,itemID10,itemValue10) {
    return new Promise((resolve, reject) => {
        axios.post('/api/qianhuan/mail', { ukey:ukey,command:command,mailID:mailID,
            itemID1:itemID1,itemValue1:itemValue1,itemID2:itemID2,itemValue2:itemValue2,itemID3:itemID3,itemValue3:itemValue3,
            itemID4:itemID4,itemValue4:itemValue4,itemID5:itemID5,itemValue5:itemValue5,
            itemID6:itemID6,itemValue6:itemValue6,itemID7:itemID7,itemValue7:itemValue7,itemID8:itemID8,itemValue8:itemValue8,
            itemID9:itemID9,itemValue9:itemValue9,itemID10:itemID10,itemValue10:itemValue10}).then( response => {
            resolve(response.data);
          }).catch(err => {
            reject(err);
          });
    });
}
//#endif _QIANHUAN_MAIL

// _COMPLAINT
exports.getComplaint = function(ukey){
    return new Promise((resolve, reject) => {
        axios.get('/api/complaint',{params:{ukey:ukey}}).then( response =>{
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    });
}

exports.updateComplaintComplete = function(ukey,command,complaint_id) {
    return new Promise((resolve, reject) => {
        axios.post('/api/complaint', { ukey:ukey,command:command,complaint_id}).then( response => {
            resolve(response.data);
          }).catch(err => {
            reject(err);
          });
    });
}



// stat ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.getNru = function(ukey,days) {
    return new Promise((resolve, reject) => {
        axios.get('/api/nru',{params:{ukey:ukey,days:days}}).then( response =>{
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    });
}

exports.getDau = function(ukey,days) {
    return new Promise((resolve, reject) => {
        axios.get('/api/dau',{params:{ukey:ukey,days:days}}).then( response =>{
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    });
}

exports.getInApp = function(ukey,days) {
    return new Promise((resolve, reject) => {
        axios.get('/api/in_app',{params:{ukey:ukey,days:days}}).then( response =>{
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    });
}

exports.getConcurrentUsers = function(ukey) {
    return new Promise((resolve, reject) => {
        axios.get('/api/concurrent_users',{params:{ukey:ukey}}).then( response =>{
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    });
}

// log /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.getManagerLog = function(ukey,page) {
    return new Promise((resolve, reject) => {
        axios.get('/api/log_manager',{params:{ukey:ukey,page:page}}).then( response =>{
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    });
}

exports.getUserLogList = function(ukey,world,postfix) {
    return new Promise((resolve, reject) => {
        axios.get('/api/log_user_list',{params:{ukey:ukey,world:world,postfix:postfix}}).then( response =>{
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    });
}

exports.getUserLog = function(ukey,world,postfix,logName,startTime,endTime,page,nick) {
    return new Promise((resolve, reject) => {
        axios.get('/api/log_user',{params:{ukey:ukey,world:world,postfix:postfix,logName:logName,startTime:startTime,endTime:endTime,page:page,nick:nick}}).then( response =>{
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    });
}

// admin ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.getManager = function(ukey) {
    return new Promise((resolve, reject) => {
        axios.get('/api/manager',{params:{ukey:ukey}}).then( response =>{
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    });
}

exports.setManager = function(ukey,command,managerId,managerPwd,managerGrade) {
    return new Promise((resolve, reject) => {
        axios.post('/api/manager',{ukey:ukey,command:command,managerId:managerId,managerPwd:managerPwd,managerGrade:managerGrade}).then( response =>{
            //resolve(response.result);
            resolve(response.data);
        }).catch(err => {
            window.alert(err);
            reject(err);
        });
    });
}

exports.uploadDataFile = function(formData) {
    return new Promise((resolve, reject) => {
        axios.post("api/upload_data", formData).then( response =>{
            resolve(response.data);
        }).catch(err => {
            window.alert(err);
            reject(err);
        })
    });
}