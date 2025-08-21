const config = require('../../config');
const logger = require('../libs/logger')(config.log.dir,config.log.name,config.log.level);
const dataManager = require('../libs/dataManager');

const sql = require('../models/mysql-db');
const tcp = require('../models/tcp');

const { insertCrmLog } = require('../libs/logHelper'); // 공용 로그 함수 import

module.exports = function(app) {
    app.route('/api/notice').get(select).post(update); 

    //set arena reward scheduler by 1 min(60 secs).
    setInterval( () => { onTimer(); }, 60000);
}

function onTimer(){
    let query = 'select ukey,idx,worldIdx,message,sendDate,sendTerm,sendCount,completedCount,lastDate,now() as now from crmdb.tbl_notice where sendCount > completedCount order by createDate desc limit 10;';
    sql.execute_crmdb(query).then(result => {
        for(let i=0; i<result.length; i++){
            let sendCount = Number(result[i].sendCount);
            let completedCount = Number(result[i].completedCount);
            if(completedCount < sendCount){
                let now = result[i].now;
                let sendDate = result[i].lastDate;
                sendDate.setMinutes(sendDate.getMinutes()+result[i].sendTerm);
                if(sendDate.getTime()<=now.getTime()){
                    tcp.sendNotice(result[i].worldIdx,result[i].message,function(response){
                        completedCount++;
                        //logger.debug('sendNotice worldIdx : ' + result[i].worldIdx + ' message : ' + result[i]wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww.message + ' count : ' + completedCount );
                        // c9soft-sp_log변경
                         //let query = 'update tbl_notice set completedCount='+completedCount+',lastDate=now() where ukey='+result[i].ukey+' and idx='+result[i].idx+'; ';
                        // query += 'insert into tbl_log(ukey,idx,type,message) select ukey, ifnull(max(idx),-1)+1, 4, \'SEND_NOTICE\' from tbl_log where ukey='+result[i].ukey+';';
                        // sql.execute_crmdb(query).then(result => {
                        let query = `update tbl_notice set completedCount=?,lastDate=now() where ukey=? and idx=?;`;
                        let params = [completedCount, result[i].ukey, result[i].idx];                            
                        sql.execute_crmdb(query,params).then(result => {
                            insertCrmLog(req.body.ukey, 'timer', 4, 'SEND_NOTICE', 'SEND_NOTICE').then(() => {
                            }).catch(err => {
                                logger.error(`manager process error : ${err.message}`);
                            });                            
                        }).catch(err =>{
                            logger.error('sendNotice process error : ' + err.message );
                        });
                    });
                }
            }
        }  
    }).catch(err =>{
        logger.error('notice onTimer process error : ' + err.message );
    });
}

var select =  function(req,res) {
    logger.debug('get request path:' + req.path + ' (query:' + Object.keys(req.query) + ' values:' + Object.values(req.query) + ')');

    let query = 'select b.id as sender,a.ukey as senderUkey,a.idx,a.worldIdx,a.message,a.sendDate,a.sendTerm,a.sendCount,a.completedCount,a.createDate as date,a.lastDate as completedDate from crmdb.tbl_notice a join tbl_account b on a.ukey = b.ukey order by a.createDate desc limit 0,50;';
    sql.execute_crmdb(query).then(result => {
        res.json({result:result});  
    }).catch(err =>{
        res.json({message:err});
    });
}

var update = function(req,res) {
    logger.debug('post request path:' + req.path + ' (body:' + Object.keys(req.body)  + ' values:' + Object.values(req.body) + ')');

    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;    

    let command = req.body.command;

    if(command === 'SEND_NOTICE'){

        if(typeof req.body.woridIdx === 'undefined' || typeof req.body.msg === 'undefined' || req.body.msg.length < 0 ||
        typeof req.body.starttime === 'undefined' || typeof req.body.term === 'undefined' || typeof req.body.count === 'undefined'){
            res.json({result:'request error'});
            return logger.error('request body error');
        }

        let message = command + ' => { woridIdx : ' + req.body.woridIdx + ', msg : ' +  req.body.msg + ', starttime : ' +  req.body.starttime + '}'; 

        // now
        if(req.body.starttime.length < 14 ){
            tcp.sendNotice(req.body.woridIdx,req.body.msg,function(response){
                logger.debug(`sendNotice worldIdx : ${req.body.woridIdx} message : ${req.body.msg}`);
                // c9soft-sp_log변경
                //let query = 'insert into tbl_notice(ukey,idx,worldIdx,message,sendDate,sendTerm,sendCount,completedCount) select '+req.body.ukey+', ifnull(max(idx),-1)+1,'+req.body.woridIdx+', \''+req.body.msg+'\',now(),1,1,1 from tbl_notice where ukey='+req.body.ukey+';';
                //query += 'insert into tbl_log(ukey,idx,type,message) select ukey, ifnull(max(idx),-1)+1, 4, \''+message+'\' from tbl_log where ukey='+req.body.ukey+';';
                let query = `insert into tbl_notice(ukey,idx,worldIdx,message,sendDate,sendTerm,sendCount,completedCount) select ?, ifnull(max(idx),-1)+1,?,?,now(),1,1,1 from tbl_notice where ukey=?;`;
                let params = [req.body.ukey, req.body.woridIdx, req.body.msg, req.body.ukey];
                sql.execute_crmdb(query,params).then(result => {
                    res.json({result:result});

                    insertCrmLog(req.body.ukey, clientIp, 4, command, message).then(() => {
                    }).catch(err => {
                        logger.error(`manager process error : ${err.message}`);
                    });                     
                }).catch(err =>{
                    logger.error(`insert sendnotice process error : ${err.message}`);
                });
            });
        }
        // reservation
        else{
            // c9soft-sp_log변경
            //let query = 'insert into tbl_notice(ukey,idx,worldIdx,message,sendDate,sendTerm,sendCount) select '+req.body.ukey+', ifnull(max(idx),-1)+1,'+req.body.woridIdx+', \''+req.body.msg+'\',\''+req.body.starttime+'\','+req.body.term+','+req.body.count+' from tbl_notice where ukey='+req.body.ukey+';';
            //query += 'insert into tbl_log(ukey,idx,type,message) select ukey, ifnull(max(idx),-1)+1, 4, \''+message+'\' from tbl_log where ukey='+req.body.ukey+';';
            let query = `insert into tbl_notice(ukey,idx,worldIdx,message,sendDate,sendTerm,sendCount) select ?, ifnull(max(idx),-1)+1,?,?,?,?,? from tbl_notice where ukey=?;`;
            let params = [req.body.ukey, req.body.woridIdx, req.body.msg, req.body.starttime, req.body.term, req.body.count, req.body.ukey];
            sql.execute_crmdb(query,params).then(result => {
                logger.debug(`insertNotice worldIdx ${req.body.woridIdx} message : ${req.body.msg}`);
                res.json({result:result});

                insertCrmLog(req.body.ukey, clientIp, 4, command, message).then(() => {
                }).catch(err => {
                    logger.error(`manager process error : ${err.message}`);
                });                 
            }).catch(err =>{
                logger.error(`insert sendnotice process error : ${err.message}`);
                res.json({result:err});
            });
        }
    }
    else{
        if(typeof req.body.senderUkey === 'undefined' || typeof req.body.idx === 'undefined'){
            res.json({result:'request error'});
            return logger.error('request body error');
        }

        let message = command + ' => { idx : ' + req.body.idx + '}'; 
        
        // c9soft-sp_log변경
        //let message = command + ' => { idx : ' + req.body.idx + '}'; 
        //let query = 'delete from tbl_notice where ukey='+req.body.senderUkey+' and idx='+req.body.idx+';';
        //query += 'insert into tbl_log(ukey,idx,type,message) select ukey, ifnull(max(idx),-1)+1, 4, \''+message+'\' from tbl_log where ukey='+req.body.ukey+';';
        let query = `delete from tbl_notice where ukey=? and idx=?;`;
        let params = [req.body.senderUkey, req.body.idx];
        sql.execute_crmdb(query,params).then(result => {
            logger.debug(`deleteNotice ukey : ${req.body.senderUkey} idx : ${req.body.idx}`);
            res.json({result:result});

            insertCrmLog(req.body.ukey, clientIp, 4, command, message).then(() => {
            }).catch(err => {
                logger.error(`manager process error : ${err.message}`);
            }); 
        }).catch(err =>{
            logger.error(`insert sendnotice process error : ${err.message}`);
            res.json({result:err});
        });
    }
}