const config = require('../../../config');
const logger = require('../../libs/logger')(config.log.dir,config.log.name,config.log.level);

const sql = require('../../models/mysql-db');


// api
// : 유저 신고하기
module.exports = function(app) {
    app.route('/api/user/complaint').get(select).post(update);
}

// 신고 목록 읽어오기
var select =  function(req,res) {
    let query = `select * from tbl_complaint order by reg_date desc;`;
    sql.execute_crmdb(query).then(result => {
        res.json({result:result});  
    }).catch(err =>{
        res.json({message:err});
    });
}

// 신고 목록 추가하기
var update = async function(req,res) {

/*
        {
            "world_id":1,                           // 월드 번호
            "user_id":2020020000001,                // 신고자 user_id
            "nickname":"asfasdf",                   // 신고자 nickname
            "target_user_id":192020020000001,       // 신고된 user_id
            "target_nickname":"1as5df5q3qwf",       // 신고된 유저 nickname
            "msg":"나쁜새끼",                           // 신고 내용
            "chat":"신고하는 채팅내용임"                // 신고할 채팅 내용
        }
*/
/*      응답 유형
        // 성공
        {
            "ret_code": 0,
        }
        // 실패
        {
            "ret_code": 120,	// err_code
            "err_msg": "mysql proceudre ret error"
        }
*/

        

    // 결과 정보 초기화
    let rinfo = {
		world_id : 0,           // 월드 번호
		user_id : 0,            // 신고자 월드 유저 고유 번호
        nickname : '',          // 신고자 닉네임
        target_user_id : 0,     // 신고할 캐릭 유저 고유 번호
        target_nickname : '',   // 신고할 캐릭명
        msg : '',               // 신고 내용
        chat : '',              // 신고할 채팅 내용
        ret_code : 100,     
        err_msg : '',
        rsn : '',
    }; 

    try {

        // body check
        const requiredParams = ['world_id', 'user_id', 'nickname', 'target_user_id', 'target_nickname', 'msg', 'chat'];
        for (const param of requiredParams) {
            if (typeof req.body[param] === 'undefined') {
                throw new Error(`not exists ${param}`);
            }
        }

        rinfo = {
            world_id : req.body.world_id,
            user_id : req.body.user_id,
            nickname : req.body.nickname,
            target_user_id : req.body.target_user_id,
            target_nickname : req.body.target_nickname,
            msg : req.body.msg,
            chat : req.body.chat,
            ret_code : 100,
            err_msg : '',
            rsn : '',
        };

        let query = `INSERT INTO tbl_complaint (type, world_id, user_idx, nickname, target_user_idx, target_nickname, msg, chat) 
                            VALUES(1, ${rinfo.world_id}, ${rinfo.user_id}, '${rinfo.nickname}', ${rinfo.target_user_id}, '${rinfo.target_nickname}', '${rinfo.msg}', '${rinfo.chat}');`;
        sql.execute_crmdb(query).then(result => {
/*
        CREATE TABLE `tbl_complaint` (
        `complaint_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '순서',
        `type` int(11) NOT NULL DEFAULT '0' COMMENT '신고 종류',
        `world_id` int(11) NOT NULL COMMENT '월드 번호',
        `user_idx` bigint(20) NOT NULL COMMENT '신고자 user_idx',
        `nickname` varchar(45) NOT NULL COMMENT '신고자 nickname',
        `target_user_idx` bigint(20) NOT NULL COMMENT '신고 당한 캐릭 user_idx',
        `target_nickname` varchar(45) NOT NULL COMMENT '신고 당한 캐릭명',
        `msg` varchar(500) NOT NULL COMMENT '신고 내용',
        `chat` varchar(500) NOT NULL COMMENT '신고할 채팅 내용',
        `reg_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '등록 날짜',
        PRIMARY KEY (`complaint_id`)
        ) ENGINE=InnoDB AUTO_INCREMENT=10010 DEFAULT CHARSET=utf8mb4 COMMENT='유저 신고 ';


            {
                "result": {
                    "fieldCount": 0,
                    "affectedRows": 1,
                    "insertId": 10008,
                    "serverStatus": 2,
                    "warningCount": 0,
                    "message": "",
                    "protocol41": true,
                    "changedRows": 0
                }
            }
*/
            res.json({ret_code:0});
        }).catch(err =>{
            //logger.error('user character quest select error : ' + err.message );
            res.json({ret_code:1,err_msg:err.message});
        });
    } catch(err) {
        //logger.error('user character quest select error : ' + err.message );
        res.json({ret_code:2,err_msg:err.message});
    }
}