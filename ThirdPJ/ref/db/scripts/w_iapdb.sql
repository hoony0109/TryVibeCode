-- MySQL dump 10.13  Distrib 5.7.40, for Win64 (x86_64)
--
-- Host: localhost    Database: w_iapdb
-- ------------------------------------------------------
-- Server version	5.7.40-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cashb_control_data_game`
--

DROP TABLE IF EXISTS `cashb_control_data_game`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cashb_control_data_game` (
  `update_key` int(11) NOT NULL COMMENT '기준 시를 지났는지 판별하기 위한 키값',
  `world_id` int(11) NOT NULL COMMENT '월드 번호, 0인경우 전체 월드를 합한 수량임',
  `cashb_qty` bigint(20) NOT NULL DEFAULT '0' COMMENT '지급한 붉은 보석 수량\n',
  `cashb_qty_max` bigint(20) NOT NULL DEFAULT '0' COMMENT '지급 가능한 붉은 수정 최대 수량',
  `data_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '날짜(day로 구분)',
  PRIMARY KEY (`world_id`,`update_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='각 월드별 드랍되는 붉은 보석 수량 조절';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cashb_control_data_world`
--

DROP TABLE IF EXISTS `cashb_control_data_world`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cashb_control_data_world` (
  `update_key` int(11) NOT NULL COMMENT '기준 시를 지났는지 판별하기 위한 키값',
  `world_id` int(11) NOT NULL COMMENT '월드 번호',
  `cashb_type` tinyint(4) NOT NULL COMMENT '지급 타입',
  `cashb_subtype` int(11) NOT NULL,
  `cashb_qty` bigint(20) NOT NULL DEFAULT '0' COMMENT '지급한 붉은 보석 수량\n',
  `cashb_qty_max` bigint(20) NOT NULL DEFAULT '0' COMMENT '지급 가능한 붉은 수정 최대 수량',
  `data_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '날짜(day로 구분)',
  PRIMARY KEY (`update_key`,`world_id`,`cashb_type`,`cashb_subtype`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='각 월드별 드랍되는 붉은 보석 수량 조절';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `event_bitcoin_datas`
--

DROP TABLE IF EXISTS `event_bitcoin_datas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `event_bitcoin_datas` (
  `account_id` bigint(20) NOT NULL,
  `event_type` tinyint(4) NOT NULL,
  `condition_1` int(11) NOT NULL DEFAULT '0',
  `condition_2` int(11) NOT NULL DEFAULT '0',
  `value` bigint(20) NOT NULL DEFAULT '0' COMMENT '값',
  `update_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '업데이트 날짜',
  PRIMARY KEY (`account_id`,`event_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='비트코인 이벤트 데이터';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_iap`
--

DROP TABLE IF EXISTS `tbl_iap`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_iap` (
  `txid` varchar(128) NOT NULL COMMENT 'txID 고유 번호(개발사가 발급하는 구매 고유 번호)\n<world_id(WWW)>_<server_session_id>_<datetime(yymmddHHMMSS)>_<Count(KKKKK)>',
  `txid_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '구매 처리 예약 시간',
  `receipt` varchar(512) NOT NULL DEFAULT '',
  `world_idx` int(11) NOT NULL COMMENT '월드 고유 번호',
  `db_idx` int(11) NOT NULL COMMENT '구매 처리하는 서버 고유 번호',
  `account_id` bigint(20) NOT NULL DEFAULT '0',
  `user_id` bigint(20) NOT NULL COMMENT '유저 고유 번호',
  `char_id` bigint(20) NOT NULL COMMENT '구매 캐릭터 고유 번호',
  `product_id` varchar(64) NOT NULL,
  `pay_complete` tinyint(4) NOT NULL DEFAULT '0' COMMENT '구매가 완료 되었는지(영수증 처리가 되었나)\n(0:구매미완료, 1:구매완료확인)',
  `pay_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `give_complete` tinyint(4) NOT NULL DEFAULT '0' COMMENT '지급 완료 되었는지(구매 여부 확인후 아이템 지급이 완료 되었나)\n(0:미지급, 1:지급처리중, 2:지급완료)',
  `give_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`txid`),
  KEY `idx_userid` (`world_idx`,`user_id`),
  KEY `tx_receipt` (`receipt`),
  KEY `tx_userid_pay` (`user_id`,`product_id`,`pay_complete`),
  KEY `ix_price` (`account_id`,`give_complete`,`give_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='구매 관련 기록';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_iap_price`
--

DROP TABLE IF EXISTS `tbl_iap_price`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_iap_price` (
  `product_id` varchar(128) NOT NULL,
  `price` int(11) NOT NULL DEFAULT '0',
  `price_ori` double NOT NULL DEFAULT '0',
  PRIMARY KEY (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='상품별 가격';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_iap_result`
--

DROP TABLE IF EXISTS `tbl_iap_result`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_iap_result` (
  `iap_idx` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '순번(AI)',
  `world_idx` int(11) NOT NULL COMMENT '월드 고유 번호',
  `db_idx` int(11) NOT NULL COMMENT '구매 처리하는 서버 고유 번호',
  `account_id` bigint(20) NOT NULL DEFAULT '0',
  `user_id` bigint(20) NOT NULL COMMENT '유저 고유 번호',
  `char_id` bigint(20) NOT NULL COMMENT '구매 캐릭터 고유 번호',
  `product_id` varchar(64) NOT NULL,
  `order_id` varchar(128) NOT NULL DEFAULT '',
  `give_complete` tinyint(4) NOT NULL DEFAULT '0' COMMENT '지급 완료 되었는지(구매 여부 확인후 아이템 지급이 완료 되었나)\n(0:미지급, 1:지급처리중, 2:지급완료)',
  `reg_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`iap_idx`),
  KEY `idx_userid` (`user_id`),
  KEY `tx_orderid` (`order_id`),
  KEY `tx_userid_pay` (`user_id`,`product_id`,`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8 COMMENT='인앱 결제 결과 기록';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_item`
--

DROP TABLE IF EXISTS `tbl_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbl_item` (
  `item_id` varchar(128) NOT NULL,
  `item_price` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_coupon`
--

DROP TABLE IF EXISTS `user_coupon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_coupon` (
  `coupon_id` varchar(16) NOT NULL COMMENT '쿠폰 ID\n',
  `coupon_type` int(11) NOT NULL DEFAULT '0' COMMENT '쿠폰 종류',
  `regist_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '쿠폰 등록 시간',
  PRIMARY KEY (`coupon_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_coupon_type`
--

DROP TABLE IF EXISTS `user_coupon_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_coupon_type` (
  `type_id` int(11) NOT NULL COMMENT '쿠폰 종류 고유 번호',
  `desc` varchar(128) NOT NULL DEFAULT '',
  `use_type` tinyint(4) NOT NULL DEFAULT '0' COMMENT '사용 타입(0:단수S, 1:멀티M)',
  `post_sender_name` varchar(64) NOT NULL COMMENT '쿠폰 보상 지급시 보내는 사람 이름',
  `post_content` varchar(128) NOT NULL COMMENT '우편 내용',
  `post_text_id` smallint(6) NOT NULL DEFAULT '0' COMMENT '우편 내용 추가 내용',
  `post_keep_day` smallint(6) NOT NULL DEFAULT '7',
  `start_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '쿠폰 지급 시작 날짜',
  `expire_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '쿠폰 지급 만료 날짜',
  `reward_gold` bigint(20) NOT NULL DEFAULT '0' COMMENT '보상 금전',
  `reward_greenruby` bigint(20) NOT NULL DEFAULT '0' COMMENT '보상 푸른 수정(CashA)',
  `reward_redruby` bigint(20) NOT NULL DEFAULT '0' COMMENT '보상 붉은 수정(CashB)',
  `reward_item_1_type` tinyint(4) NOT NULL DEFAULT '0' COMMENT '보상 아이템 1 타입\n',
  `reward_item_1_id` int(11) NOT NULL DEFAULT '0' COMMENT '보상 아이템 1 아이디',
  `reward_item_1_qty` int(11) NOT NULL DEFAULT '0' COMMENT '보상 아이템 1 수량',
  `reward_item_2_type` tinyint(4) NOT NULL DEFAULT '0',
  `reward_item_2_id` int(11) NOT NULL DEFAULT '0',
  `reward_item_2_qty` int(11) NOT NULL DEFAULT '0',
  `reward_item_3_type` tinyint(4) NOT NULL DEFAULT '0',
  `reward_item_3_id` int(11) NOT NULL DEFAULT '0',
  `reward_item_3_qty` int(11) NOT NULL DEFAULT '0',
  `reward_item_4_type` tinyint(4) NOT NULL DEFAULT '0',
  `reward_item_4_id` int(11) NOT NULL DEFAULT '0',
  `reward_item_4_qty` int(11) NOT NULL DEFAULT '0',
  `reward_item_5_type` tinyint(4) NOT NULL DEFAULT '0',
  `reward_item_5_id` int(11) NOT NULL DEFAULT '0',
  `reward_item_5_qty` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='쿠폰의 종류를 정의한 테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_coupon_used`
--

DROP TABLE IF EXISTS `user_coupon_used`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_coupon_used` (
  `coupon_id` varchar(16) NOT NULL COMMENT '쿠폰 ID\n',
  `user_idx` bigint(20) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '지급 상태 = 0:지급중, 1:지급 완료',
  `use_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '사용 시간',
  PRIMARY KEY (`coupon_id`,`user_idx`),
  KEY `ix_user` (`user_idx`,`coupon_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'w_iapdb'
--
/*!50003 DROP PROCEDURE IF EXISTS `isp_iap_complete_finish_update` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `isp_iap_complete_finish_update`(
	IN p_UserID		BIGINT				-- 유저 고유 번호
,	IN p_OrderID	VARCHAR(512)		-- 영수증 번호
)
    COMMENT '인앱 구매 완료후 Complete 완료 정보 넣기'
BEGIN
	DECLARE	v_errno			INT DEFAULT 0;
	DECLARE v_result 		INT DEFAULT 0;

    DECLARE v_give_comlpete	INT DEFAULT 0;
    
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		GET CURRENT DIAGNOSTICS CONDITION 1
			v_errno = MYSQL_ERRNO;
			SET v_result := (v_errno * -1);
		ROLLBACK;

		SELECT v_result;
	END;
    
    
	root:
	BEGIN
    
		-- 데이터 확인
        SELECT give_complete INTO v_give_comlpete
        FROM tbl_iap_result
        WHERE order_id = p_OrderID; --  AND user_id = p_UserID;
        
        IF FOUND_ROWS() = 0 THEN
			SET v_result = 6121;		-- 예약 데이터 없슴
			LEAVE root;
        END IF;
        
        -- 처리 중 OR 처리 완료 확인
        IF v_give_comlpete <> 1 THEN
			IF v_give_comlpete = 0 THEN
				SET v_result = 6122;		-- 검증 안됨
				LEAVE root;
            END IF;
            
			IF v_give_comlpete = 2 THEN
				SET v_result = 6123;		-- 이미 Complete 완료
				LEAVE root;
            END IF;
            
            SET v_result = 6124;		-- Invalid 값
            LEAVE root;
        END IF;
        
    
		-- Complete 시작
		UPDATE tbl_iap_result
		SET give_complete = 2 -- , give_time = NOW()
		WHERE order_id = p_OrderID; --  AND user_id = p_UserID;

		IF ROW_COUNT() <> 1 THEN
			SET v_result = 6125;		-- 완료 실패
		END IF;

    END;
    
	
	SELECT v_result;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `isp_iap_complete_update` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `isp_iap_complete_update`(
	IN p_WorldID	INT					-- 월드 번호
,	IN p_DBIdx		int					-- 샤딩 디비 번호
,	IN p_AccountID	BIGINT				-- 계정 고유 번호
,	IN p_UserID		BIGINT				-- 유저 고유 번호
,	IN p_CharID 	BIGINT				-- 캐릭터 고유 번호
,	IN p_OrderID	VARCHAR(512)		-- 영수증 번호
,	IN p_ProductID	VARCHAR(128)		-- 구매 제품
)
    COMMENT '인앱 구매 완료후 Complete 시작 정보 넣기'
BEGIN
	DECLARE	v_errno			INT DEFAULT 0;
	DECLARE v_result 		INT DEFAULT 0;
    
    DECLARE v_give_comlpete		INT DEFAULT 0;
    
    -- DECLARE v_first_all			TINYINT DEFAULT 0;			-- 첫 구매 인지(전체)
    -- DECLARE v_first_product		TINYINT DEFAULT 0;    		-- 첫 구매 인지(상품별)
	-- DECLARE v_first_txid		VARCHAR(128) DEFAULT '';	-- 첫번째 구매 TXID    
    
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		GET CURRENT DIAGNOSTICS CONDITION 1
			v_errno = MYSQL_ERRNO;
			SET v_result := (v_errno * -1);
		ROLLBACK;

		SELECT v_result; -- , v_first_all, v_first_product;
	END;
    
    
	root:
	BEGIN
    
		-- 데이터 확인
        SELECT give_complete INTO v_give_comlpete
        FROM tbl_iap_result
        WHERE order_id = p_OrderID; --  AND user_id = p_UserID;

		-- 영수증 중복 확인
        IF 1 < v_give_comlpete THEN
        -- IF EXISTS (SELECT * FROM tbl_iap_result WHERE order_id = p_OrderID) THEN
			SET v_result = 19383;		-- 영수증 중복 (ERR_SHOP_INAPP_API_EXIST_DUPL_RECEIPT)
			LEAVE root;
        END IF;
        
        INSERT INTO tbl_iap_result (`world_idx`,`db_idx`,`account_id`,`user_id`,`char_id`,`product_id`,`order_id`,`give_complete`)
			VALUES (p_WorldID, p_DBIdx, p_AccountID, p_UserID, p_CharID, p_ProductID, p_OrderID, 1);

		IF ROW_COUNT() <> 1 THEN
			SET v_result = 6120;		-- 등록 실패
		END IF;
    
		-- 첫구매(전체)
		-- SELECT txid INTO v_first_txid
        -- FROM tbl_iap
        -- WHERE user_id = p_UserID AND 0 < pay_complete 
        -- ORDER BY txid_time LIMIT 1;
       
        -- IF v_first_txid = p_TXID THEN
		-- 	SET v_first_all = 1;		-- 첫구매임(전체)
        -- END IF;
       
		-- 첫구매(상품별)
		-- SELECT txid INTO v_first_txid
        -- FROM tbl_iap
        -- WHERE user_id = p_UserID AND product_id = v_product_id AND 0 < pay_complete 
        -- ORDER BY txid_time LIMIT 1;
        
        -- IF v_first_txid = p_TXID THEN
		-- 	SET v_first_product = 1;	-- 첫구매임(상품별)
        -- END IF;

    END;
    
	
	SELECT v_result; -- , v_first_all, v_first_product;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `isp_iap_onestore_noconsume_complete_update2` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `isp_iap_onestore_noconsume_complete_update2`(
	IN p_WorldIdx	INT					-- 월드 번호
,	IN p_UserID		BIGINT				-- 유저 고유 번호
,	IN p_TXID		VARCHAR(128)		-- 예약 트랜잭션 ID
,	IN p_RECEIPT	VARCHAR(512)		-- 영수증 번호
,	IN p_ProductID	VARCHAR(64)			-- 구매 제품
)
    COMMENT 'consume 안된 것들 구매 완료 처리'
BEGIN
	DECLARE	v_errno			INT DEFAULT 0;
	DECLARE v_result 		INT DEFAULT 0;
    
    DECLARE v_world_idx		INT DEFAULT 0;
    DECLARE v_db_idx		INT DEFAULT 0;
    DECLARE v_pay_comlpete	INT DEFAULT 0;
    DECLARE v_give_comlpete	INT DEFAULT 0;
    DECLARE v_receipt		VARCHAR(512) DEFAULT '';
    
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		GET CURRENT DIAGNOSTICS CONDITION 1
			v_errno = MYSQL_ERRNO;
			SET v_result := (v_errno * -1);
		ROLLBACK;

		SELECT v_result, v_db_idx;
	END;
    
    
	root:
	BEGIN

		-- 데이터 확인
        SELECT receipt,world_idx, db_idx,  pay_complete, give_complete INTO v_receipt, v_world_idx, v_db_idx, v_pay_comlpete, v_give_comlpete
        FROM tbl_iap
        WHERE txid = p_TXID AND user_id = p_UserID;
        
        IF FOUND_ROWS() = 0 THEN
			SET v_result = 101;		-- 예약 데이터 없슴
			LEAVE root;
        END IF;
        
        -- 월드 확인, 해당 월드 서버에서만 처리되게
        IF v_world_idx <> p_WorldIdx THEN
			SET v_result = 102;		-- 다른 월드에서 처리되어야 함
			LEAVE root;
        END IF;
        
        -- 처리 중 OR 처리 완료 확인(0 일 경우만 처리해야함)
        IF 1 < v_give_comlpete THEN
			
            -- 컨슘이 안된것이기 때문에 give_complete가 1인것도 처리해야 한다.
            -- 중복 소비일 경우 consume 처리 중에 걸리게 된다.
            /*
			IF v_give_comlpete = 1 THEN
				SET v_result = 102;		-- Complete 처리중
				LEAVE root;
            END IF;
			*/
			IF v_give_comlpete = 2 THEN
				SET v_result = 103;		-- Complete 완료
				LEAVE root;			
            END IF;
            
			SET v_result = 104;		-- 상태 이상
			LEAVE root;            
        END IF;
        
        -- TXID에 영수증이 이미 들어 있고
        IF v_receipt <> '' THEN
			-- 검증을 통과한 영수증과 같지 않으면...
			IF v_receipt <> p_RECEIPT THEN
				SET v_result = 106;	-- 영수증 같지 않음
				LEAVE root;
			END IF;
        END IF;        
                
        -- 영수증 중복 확인
        IF EXISTS (SELECT * FROM tbl_iap WHERE receipt = p_RECEIPT AND txid <> p_TXID) THEN
			SET v_result = 105;		-- 영수증 중복
			LEAVE root;
        END IF;
            
		-- Complete 시작
		UPDATE tbl_iap
		SET receipt = p_RECEIPT, pay_complete = 1, pay_time = NOW(), give_complete = 1
		WHERE txid = p_TXID AND user_id = p_UserID;

        IF v_receipt <> '' THEN
			-- 영수증이 없는 것들만 업데이트 성고 체크
			IF ROW_COUNT() <> 1 THEN
				SET v_result = 105;		-- 시작 실패
			END IF;
		END IF;
    
    END;
    
	
	SELECT v_result, v_db_idx;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `isp_iap_onestore_noconsume_complete_update3` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `isp_iap_onestore_noconsume_complete_update3`(
	IN p_WorldIdx	INT					-- 월드 번호
,	IN p_UserID		BIGINT				-- 유저 고유 번호
,	IN p_TXID		VARCHAR(128)		-- 예약 트랜잭션 ID
,	IN p_RECEIPT	VARCHAR(512)		-- 영수증 번호
,	IN p_ProductID	VARCHAR(64)			-- 구매 제품
)
    COMMENT 'consume 안된 것들 구매 완료 처리'
BEGIN
	DECLARE	v_errno			INT DEFAULT 0;
	DECLARE v_result 		INT DEFAULT 0;
    
    DECLARE v_world_idx		INT DEFAULT 0;
    DECLARE v_db_idx		INT DEFAULT 0;
    DECLARE v_pay_comlpete	INT DEFAULT 0;
    DECLARE v_give_comlpete	INT DEFAULT 0;
    DECLARE v_receipt		VARCHAR(512) DEFAULT '';
    DECLARE v_product_id		VARCHAR(128) DEFAULT '';
    
    DECLARE v_first_all			TINYINT DEFAULT 0;			-- 첫 구매 인지(전체)
    DECLARE v_first_product		TINYINT DEFAULT 0;    		-- 첫 구매 인지(상품별)
	DECLARE v_first_txid		VARCHAR(128) DEFAULT '';	-- 첫번째 구매 TXID      
    
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		GET CURRENT DIAGNOSTICS CONDITION 1
			v_errno = MYSQL_ERRNO;
			SET v_result := (v_errno * -1);
		ROLLBACK;

		SELECT v_result, v_db_idx, v_first_all, v_first_product; 
	END;
    
    
	root:
	BEGIN

		-- 데이터 확인
        SELECT receipt, world_idx, db_idx, product_id, pay_complete, give_complete INTO v_receipt, v_world_idx, v_db_idx, v_product_id, v_pay_comlpete, v_give_comlpete
        FROM tbl_iap
        WHERE txid = p_TXID AND user_id = p_UserID;
        
        IF FOUND_ROWS() = 0 THEN
			SET v_result = 101;		-- 예약 데이터 없슴
			LEAVE root;
        END IF;
        
        -- 월드 확인, 해당 월드 서버에서만 처리되게
        IF v_world_idx <> p_WorldIdx THEN
			SET v_result = 101;		-- 다른 월드에서 처리되어야 함
			LEAVE root;
        END IF;
        
        -- 처리 중 OR 처리 완료 확인(0 일 경우만 처리해야함)
        IF 0 < v_give_comlpete THEN
			
            -- 컨슘이 안된것이기 때문에 give_complete가 1인것도 처리해야 한다.
            -- 중복 소비일 경우 consume 처리 중에 걸리게 된다.
            
			IF v_give_comlpete = 1 THEN
				SET v_result = 102;		-- Complete 처리중
				LEAVE root;
            END IF;
			
			IF v_give_comlpete = 2 THEN
				SET v_result = 103;		-- Complete 완료
				LEAVE root;			
            END IF;
            
			SET v_result = 104;		-- 상태 이상
			LEAVE root;            
        END IF;
        
        -- TXID에 영수증이 이미 들어 있슴
        IF v_receipt <> '' THEN
			SET v_result = 106;
            LEAVE root;
        END IF;             
                
        -- 영수증 중복 확인
        IF EXISTS (SELECT * FROM tbl_iap WHERE receipt = p_RECEIPT) THEN
			SET v_result = 105;		-- 영수증 중복
			LEAVE root;
        END IF;
            
		-- Complete 시작
		UPDATE tbl_iap
		SET receipt = p_RECEIPT, pay_complete = 1, pay_time = NOW(), give_complete = 1
		WHERE txid = p_TXID AND user_id = p_UserID;

		IF ROW_COUNT() <> 1 THEN
			SET v_result = 105;		-- 시작 실패
		END IF;
        
		/*
			이벤트 데이터 추출
		*/ 

		-- 첫구매(전체)
		SELECT txid INTO v_first_txid
        FROM tbl_iap
        WHERE user_id = p_UserID AND 0 < pay_complete 
        ORDER BY txid_time LIMIT 1;
       
        IF v_first_txid = p_TXID THEN
			SET v_first_all = 1;		-- 첫구매임(전체)
        END IF;
       
		-- 첫구매(상품별)
		SELECT txid INTO v_first_txid
        FROM tbl_iap
        WHERE user_id = p_UserID AND product_id = v_product_id AND 0 < pay_complete 
        ORDER BY txid_time LIMIT 1;
        
        IF v_first_txid = p_TXID THEN
			SET v_first_product = 1;	-- 첫구매임(상품별)
        END IF;
    
    END;
    
	
	SELECT v_result, v_db_idx, v_first_all, v_first_product;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `isp_iap_reserve_insert` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `isp_iap_reserve_insert`(
	IN p_WorldID	INT					-- 월드 번호
,	IN p_DBIdx		int					-- 샤딩 디비 번호
,	IN p_AccountID	BIGINT				-- 계정 고유 번호
,	IN p_UserID		BIGINT				-- 유저 고유 번호
,	IN p_CharID 	BIGINT				-- 캐릭터 고유 번호
,	IN p_TXID		VARCHAR(128)		-- 예약 트랜잭션 ID
,	IN p_ProductID	VARCHAR(128)		-- 앱 상품 번호
)
    COMMENT '인앱 구매 예약 정보 넣기'
BEGIN
	DECLARE	v_errno			INT DEFAULT 0;
	DECLARE v_result 		INT DEFAULT 0;
    
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		GET CURRENT DIAGNOSTICS CONDITION 1
			v_errno = MYSQL_ERRNO;
			SET v_result := (v_errno * -1);
		ROLLBACK;

		SELECT v_result;
	END;
    
       
	-- 예약 정보 넣기
	INSERT INTO tbl_iap (txid, txid_time, world_idx, db_idx, account_id, user_id, char_id, product_id)
	VALUES (p_TXID, NOW(), p_WorldID, p_DBIdx, p_AccountID, p_UserID, p_CharID, p_ProductID);

	IF ROW_COUNT() <> 1 THEN
		SET v_result = 101;		-- 등록 실패
	END IF;
	
	SELECT v_result;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `msp_analysis` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `msp_analysis`(
)
    COMMENT '구매 분석 얻기'
BEGIN

	DECLARE v_date_now		timestamp DEFAULT NOW();

	DECLARE v_product_id 			VARCHAR(100) DEFAULT '';
    DECLARE v_product_cash			BIGINT DEFAULT 0;
    DECLARE v_product_buy_qty		INT DEFAULT 0;
    DECLARE v_product_buy_qty_all	INT DEFAULT 0;		-- 전체 구매 수량
	DECLARE v_product_buy_cash		BIGINT DEFAULT 0;
    DECLARE v_product_buy_cash_all	BIGINT DEFAULT 0;	-- 전체 구매 금액
    DECLARE v_product_buy_daily_qty	INT DEFAULT 0;
	
    DECLARE v_full_cash_qty		INT DEFAULT 0;
	DECLARE v_full_cash			INT DEFAULT 0;			-- 전체 결제 금액
	
	DECLARE v_account_qty			INT DEFAULT 0;			-- 계정 개수
    
	DECLARE done INTEGER DEFAULT 0;	-- 반복문변수선언		
	DECLARE openCursor CURSOR FOR SELECT fld_product_id, fld_product_price FROM _analysis_saleinfo;	-- 커서에 사용할 테이블 선언
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = true;	-- 반복문 핸들러 선언	
    
		
	SELECT count(*) INTO v_account_qty
	FROM globaldb.line_account;

    
	OPEN openCursor;	-- 커서 오픈        
		read_loop:LOOP	-- 반복문 시작
			FETCH openCursor INTO v_product_id, v_product_cash;
			
			-- 상품 구매 개수
			SELECT count(*) INTO v_product_buy_qty
			FROM iapdb.tbl_iap
			WHERE pay_complete > 0 AND product_id = v_product_id;
			
			SET v_product_buy_cash = v_product_cash * v_product_buy_qty;
			
			SET v_product_buy_cash_all = v_product_buy_cash_all + v_product_buy_cash;
			SET v_product_buy_qty_all = v_product_buy_qty_all + v_product_buy_qty;
            
            INSERT INTO _analysis_qty VALUES (v_product_id, v_product_buy_qty, v_date_now)
				ON DUPLICATE KEY UPDATE sale_qty = v_product_buy_qty, update_time = v_date_now;
                
			SELECT count(*) INTO v_product_buy_daily_qty
			FROM iapdb.tbl_iap
			WHERE pay_complete > 0 AND product_id = v_product_id AND DATE(pay_time) = DATE(v_date_now);
                
			INSERT INTO _analysis_qty_daily VALUES (DATE(v_date_now), v_product_id, v_product_buy_daily_qty, v_date_now)
				ON DUPLICATE KEY UPDATE sale_qty = v_product_buy_daily_qty, update_time = v_date_now;
			
			-- 반복문 종료시 조건
			IF done THEN 
				LEAVE read_loop;
			END IF;
		END LOOP read_loop;	-- 반복문 종료
	CLOSE openCursor;	-- 커서 닫기	
    
	
    -- 전체 결제 수량
    SET v_full_cash_qty = v_product_buy_qty_all;
	-- 전체 결제 금액
	SET v_full_cash = v_product_buy_cash_all;
	    
    

   	INSERT INTO _analysis (fld_time, account_qty, cash_full_qty, cash_full_amount) VALUES (v_date_now, v_account_qty, v_full_cash_qty, v_full_cash);


	call msp_analysis3();

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `msp_analysis3` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `msp_analysis3`(
)
    COMMENT '구매 분석'
BEGIN

	DECLARE v_date_now		TIMESTAMP DEFAULT NOW();
	DECLARE v_date_0		DATE DEFAULT DATE(NOW());
    DECLARE v_date_1		DATE DEFAULT date(subdate(now(), INTERVAL 1 DAY));


	DECLARE v_total_0		INT DEFAULT 0;    
	DECLARE v_total_cash_0		BIGINT DEFAULT 0;    
    DECLARE v_server_1_0	INT DEFAULT 0;
    
        
	DECLARE v_fld_total_qty		INT DEFAULT 0;
    DECLARE v_fld_total_amount	BIGINT DEFAULT 0;
    DECLARE v_fld_server_1		INT DEFAULT 0;
    DECLARE v_fld_server_1_cash	BIGINT DEFAULT 0;
    DECLARE v_fld_server_2		INT DEFAULT 0;
    DECLARE v_fld_server_2_cash	BIGINT DEFAULT 0;
    DECLARE v_fld_server_3		INT DEFAULT 0;
    DECLARE v_fld_server_3_cash	BIGINT DEFAULT 0;
    DECLARE v_fld_server_4		INT DEFAULT 0;
    DECLARE v_fld_server_4_cash	BIGINT DEFAULT 0;
    DECLARE v_fld_server_5		INT DEFAULT 0;
    DECLARE v_fld_server_5_cash	BIGINT DEFAULT 0;
    DECLARE v_fld_server_6		INT DEFAULT 0;
    DECLARE v_fld_server_6_cash	BIGINT DEFAULT 0;
    DECLARE v_fld_server_7		INT DEFAULT 0;
    DECLARE v_fld_server_7_cash	BIGINT DEFAULT 0;
    DECLARE v_fld_server_8		INT DEFAULT 0;
    DECLARE v_fld_server_8_cash	BIGINT DEFAULT 0;
    DECLARE v_fld_server_9		INT DEFAULT 0;
    DECLARE v_fld_server_9_cash	BIGINT DEFAULT 0;
    DECLARE v_fld_server_10		INT DEFAULT 0;
    DECLARE v_fld_server_10_cash	BIGINT DEFAULT 0;
    DECLARE v_fld_server_11		INT DEFAULT 0;
    DECLARE v_fld_server_11_cash	BIGINT DEFAULT 0;
	DECLARE v_fld_server_12		INT DEFAULT 0;
    DECLARE v_fld_server_12_cash	BIGINT DEFAULT 0;
	DECLARE v_fld_server_13		INT DEFAULT 0;
    DECLARE v_fld_server_13_cash	BIGINT DEFAULT 0;
	DECLARE v_fld_server_14		INT DEFAULT 0;
    DECLARE v_fld_server_14_cash	BIGINT DEFAULT 0;
  
    
    
    
    -- 전체 
    CALL msp_analysis_server_v2(0, v_date_0, v_total_0, v_total_cash_0);
	INSERT INTO _analysis_re (fld_time, fld_total_qty, fld_total_amount, fld_update_date) VALUES (v_date_0, v_total_0, v_total_cash_0, v_date_now)
		ON DUPLICATE KEY UPDATE fld_total_qty = v_total_0, fld_total_amount = v_total_cash_0, fld_update_date = v_date_now;


        
    
    -- world-01
    CALL msp_analysis_server_v2(1, v_date_0, v_total_0, v_total_cash_0);
	INSERT INTO _analysis_re (fld_time, fld_server_1, fld_server_1_cash, fld_update_date) VALUES (v_date_0, v_total_0, v_total_cash_0, v_date_now)
		ON DUPLICATE KEY UPDATE fld_server_1 = v_total_0, fld_server_1_cash = v_total_cash_0, fld_update_date = v_date_now;

	-- world-02
    CALL msp_analysis_server_v2(2, v_date_0, v_total_0, v_total_cash_0);
	INSERT INTO _analysis_re (fld_time, fld_server_2, fld_server_2_cash, fld_update_date) VALUES (v_date_0, v_total_0, v_total_cash_0, v_date_now)
		ON DUPLICATE KEY UPDATE fld_server_2 = v_total_0, fld_server_2_cash = v_total_cash_0, fld_update_date = v_date_now;
        
	-- world-03
    CALL msp_analysis_server_v2(3, v_date_0, v_total_0, v_total_cash_0);
	INSERT INTO _analysis_re (fld_time, fld_server_3, fld_server_3_cash, fld_update_date) VALUES (v_date_0, v_total_0, v_total_cash_0, v_date_now)
    ON DUPLICATE KEY UPDATE fld_server_3 = v_total_0, fld_server_3_cash = v_total_cash_0, fld_update_date = v_date_now;
        
	-- world-04
    CALL msp_analysis_server_v2(4, v_date_0, v_total_0, v_total_cash_0);
	INSERT INTO _analysis_re (fld_time, fld_server_4, fld_server_4_cash, fld_update_date) VALUES (v_date_0, v_total_0, v_total_cash_0, v_date_now)
		ON DUPLICATE KEY UPDATE fld_server_4 = v_total_0, fld_server_4_cash = v_total_cash_0, fld_update_date = v_date_now;

	-- world-05
    CALL msp_analysis_server_v2(5, v_date_0, v_total_0, v_total_cash_0);
	INSERT INTO _analysis_re (fld_time, fld_server_5, fld_server_5_cash, fld_update_date) VALUES (v_date_0, v_total_0, v_total_cash_0, v_date_now)
		ON DUPLICATE KEY UPDATE fld_server_5 = v_total_0, fld_server_5_cash = v_total_cash_0, fld_update_date = v_date_now;

	-- world-06
    CALL msp_analysis_server_v2(6, v_date_0, v_total_0, v_total_cash_0);
	INSERT INTO _analysis_re (fld_time, fld_server_6, fld_server_6_cash, fld_update_date) VALUES (v_date_0, v_total_0, v_total_cash_0, v_date_now)
		ON DUPLICATE KEY UPDATE fld_server_6 = v_total_0, fld_server_6_cash = v_total_cash_0, fld_update_date = v_date_now;
        
	-- world-07
    CALL msp_analysis_server_v2(7, v_date_0, v_total_0, v_total_cash_0);
	INSERT INTO _analysis_re (fld_time, fld_server_7, fld_server_7_cash, fld_update_date) VALUES (v_date_0, v_total_0, v_total_cash_0, v_date_now)
		ON DUPLICATE KEY UPDATE fld_server_7 = v_total_0, fld_server_7_cash = v_total_cash_0, fld_update_date = v_date_now;
        
	-- world-08
    CALL msp_analysis_server_v2(8, v_date_0, v_total_0, v_total_cash_0);
	INSERT INTO _analysis_re (fld_time, fld_server_8, fld_server_8_cash, fld_update_date) VALUES (v_date_0, v_total_0, v_total_cash_0, v_date_now)
		ON DUPLICATE KEY UPDATE fld_server_8 = v_total_0, fld_server_8_cash = v_total_cash_0, fld_update_date = v_date_now;
        
	-- world-09
    CALL msp_analysis_server_v2(9, v_date_0, v_total_0, v_total_cash_0);
	INSERT INTO _analysis_re (fld_time, fld_server_9, fld_server_9_cash, fld_update_date) VALUES (v_date_0, v_total_0, v_total_cash_0, v_date_now)
		ON DUPLICATE KEY UPDATE fld_server_9 = v_total_0, fld_server_9_cash = v_total_cash_0, fld_update_date = v_date_now;

	-- world-10
    CALL msp_analysis_server_v2(10, v_date_0, v_total_0, v_total_cash_0);
	INSERT INTO _analysis_re (fld_time, fld_server_10, fld_server_10_cash, fld_update_date) VALUES (v_date_0, v_total_0, v_total_cash_0, v_date_now)
		ON DUPLICATE KEY UPDATE fld_server_10 = v_total_0, fld_server_10_cash = v_total_cash_0, fld_update_date = v_date_now;

	-- world-11
    CALL msp_analysis_server_v2(11, v_date_0, v_total_0, v_total_cash_0);
	INSERT INTO _analysis_re (fld_time, fld_server_11, fld_server_11_cash, fld_update_date) VALUES (v_date_0, v_total_0, v_total_cash_0, v_date_now)
		ON DUPLICATE KEY UPDATE fld_server_11 = v_total_0, fld_server_11_cash = v_total_cash_0, fld_update_date = v_date_now;
        
	-- world-12
    CALL msp_analysis_server_v2(12, v_date_0, v_total_0, v_total_cash_0);
	INSERT INTO _analysis_re (fld_time, fld_server_12, fld_server_12_cash, fld_update_date) VALUES (v_date_0, v_total_0, v_total_cash_0, v_date_now)
		ON DUPLICATE KEY UPDATE fld_server_12 = v_total_0, fld_server_12_cash = v_total_cash_0, fld_update_date = v_date_now;
        
	-- world-13
    CALL msp_analysis_server_v2(13, v_date_0, v_total_0, v_total_cash_0);
	INSERT INTO _analysis_re (fld_time, fld_server_13, fld_server_13_cash, fld_update_date) VALUES (v_date_0, v_total_0, v_total_cash_0, v_date_now)
		ON DUPLICATE KEY UPDATE fld_server_13 = v_total_0, fld_server_13_cash = v_total_cash_0, fld_update_date = v_date_now;
           
	-- world-14
    CALL msp_analysis_server_v2(14, v_date_0, v_total_0, v_total_cash_0);
	INSERT INTO _analysis_re (fld_time, fld_server_14, fld_server_14_cash, fld_update_date) VALUES (v_date_0, v_total_0, v_total_cash_0, v_date_now)
		ON DUPLICATE KEY UPDATE fld_server_14 = v_total_0, fld_server_14_cash = v_total_cash_0, fld_update_date = v_date_now;


	-- 합계
    set v_fld_total_qty = (select sum(fld_total_qty) FROM _analysis_re as b WHERE fld_time < date('2030-01-01 00:00:00')),
		v_fld_total_amount = (select sum(fld_total_amount) FROM _analysis_re as b WHERE fld_time < date('2030-01-01 00:00:00')),
        v_fld_server_1 = (select sum(fld_server_1) FROM _analysis_re as b WHERE fld_time < date('2030-01-01 00:00:00')),
        v_fld_server_1_cash = (select sum(fld_server_1_cash) FROM _analysis_re as b WHERE fld_time < date('2030-01-01 00:00:00')),
        v_fld_server_2 = (select sum(fld_server_2) FROM _analysis_re as b WHERE fld_time < date('2030-01-01 00:00:00')),
        v_fld_server_2_cash = (select sum(fld_server_2_cash) FROM _analysis_re as b WHERE fld_time < date('2030-01-01 00:00:00')),
        v_fld_server_3 = (select sum(fld_server_3) FROM _analysis_re as b WHERE fld_time < date('2030-01-01 00:00:00')),
        v_fld_server_3_cash = (select sum(fld_server_3_cash) FROM _analysis_re as b WHERE fld_time < date('2030-01-01 00:00:00')),
        v_fld_server_4 = (select sum(fld_server_4) FROM _analysis_re as b WHERE fld_time < date('2030-01-01 00:00:00')),
        v_fld_server_4_cash = (select sum(fld_server_4_cash) FROM _analysis_re as b WHERE fld_time < date('2030-01-01 00:00:00')),
        v_fld_server_5 = (select sum(fld_server_5) FROM _analysis_re as b WHERE fld_time < date('2030-01-01 00:00:00')),
        v_fld_server_5_cash = (select sum(fld_server_5_cash) FROM _analysis_re as b WHERE fld_time < date('2030-01-01 00:00:00')),
        v_fld_server_6 = (select sum(fld_server_6) FROM _analysis_re as b WHERE fld_time < date('2030-01-01 00:00:00')),
        v_fld_server_6_cash = (select sum(fld_server_6_cash) FROM _analysis_re as b WHERE fld_time < date('2030-01-01 00:00:00')),
        v_fld_server_7 = (select sum(fld_server_7) FROM _analysis_re as b WHERE fld_time < date('2030-01-01 00:00:00')),
        v_fld_server_7_cash = (select sum(fld_server_7_cash) FROM _analysis_re as b WHERE fld_time < date('2030-01-01 00:00:00')),
        v_fld_server_8 = (select sum(fld_server_8) FROM _analysis_re as b WHERE fld_time < date('2030-01-01 00:00:00')),
        v_fld_server_8_cash = (select sum(fld_server_8_cash) FROM _analysis_re as b WHERE fld_time < date('2030-01-01 00:00:00')),
        v_fld_server_9 = (select sum(fld_server_9) FROM _analysis_re as b WHERE fld_time < date('2030-01-01 00:00:00')),
        v_fld_server_9_cash = (select sum(fld_server_9_cash) FROM _analysis_re as b WHERE fld_time < date('2030-01-01 00:00:00')),
        v_fld_server_10 = (select sum(fld_server_10) FROM _analysis_re as b WHERE fld_time < date('2030-01-01 00:00:00')),
        v_fld_server_10_cash = (select sum(fld_server_10_cash) FROM _analysis_re as b WHERE fld_time < date('2030-01-01 00:00:00')),
        v_fld_server_11 = (select sum(fld_server_11) FROM _analysis_re as b WHERE fld_time < date('2030-01-01 00:00:00')),
        v_fld_server_11_cash = (select sum(fld_server_11_cash) FROM _analysis_re as b WHERE fld_time < date('2030-01-01 00:00:00')),
        v_fld_server_12 = (select sum(fld_server_12) FROM _analysis_re as b WHERE fld_time < date('2030-01-01 00:00:00')),
        v_fld_server_12_cash = (select sum(fld_server_12_cash) FROM _analysis_re as b WHERE fld_time < date('2030-01-01 00:00:00')),
        v_fld_server_13 = (select sum(fld_server_13) FROM _analysis_re as b WHERE fld_time < date('2030-01-01 00:00:00')),
        v_fld_server_13_cash = (select sum(fld_server_13_cash) FROM _analysis_re as b WHERE fld_time < date('2030-01-01 00:00:00')),
		v_fld_server_14 = (select sum(fld_server_14) FROM _analysis_re as b WHERE fld_time < date('2030-01-01 00:00:00')),
        v_fld_server_14_cash = (select sum(fld_server_14_cash) FROM _analysis_re as b WHERE fld_time < date('2030-01-01 00:00:00'));
    
	update _analysis_re 
    set fld_total_qty = v_fld_total_qty, fld_total_amount = v_fld_total_amount,
        fld_server_1 = v_fld_server_1, fld_server_1_cash = v_fld_server_1_cash,
        fld_server_2 = v_fld_server_2, fld_server_2_cash = v_fld_server_2_cash,
        fld_server_3 = v_fld_server_3, fld_server_3_cash = v_fld_server_3_cash,
        fld_server_4 = v_fld_server_4, fld_server_4_cash = v_fld_server_4_cash,
        fld_server_5 = v_fld_server_5, fld_server_5_cash = v_fld_server_5_cash,
        fld_server_6 = v_fld_server_6, fld_server_6_cash = v_fld_server_6_cash,
        fld_server_7 = v_fld_server_7, fld_server_7_cash = v_fld_server_7_cash,
        fld_server_8 = v_fld_server_8, fld_server_8_cash = v_fld_server_8_cash,
        fld_server_9 = v_fld_server_9, fld_server_9_cash = v_fld_server_9_cash, 
        fld_server_10 = v_fld_server_10, fld_server_10_cash = v_fld_server_10_cash, 
        fld_server_11 = v_fld_server_11, fld_server_11_cash = v_fld_server_11_cash, 
        fld_server_12 = v_fld_server_12, fld_server_12_cash = v_fld_server_12_cash, 
        fld_server_13 = v_fld_server_13, fld_server_13_cash = v_fld_server_13_cash, 
		fld_server_14 = v_fld_server_14, fld_server_14_cash = v_fld_server_14_cash, 
        fld_update_date = v_date_now
	where fld_time = date('2030-01-01 00:00:00');    

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `msp_analysis_server_v2` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `msp_analysis_server_v2`(
	IN p_WorldID		INT
,	IN p_Date			timestamp
,	OUT p_BuyQty		INT 			-- 구매 건수
,	OUT p_BuyAmount		BIGINT			-- 총 구매 금액
)
    COMMENT '구매 분석'
BEGIN
	DECLARE v_date_0		DATE DEFAULT DATE(p_Date);
  
	DECLARE v_product_id 			VARCHAR(100) DEFAULT '';
    DECLARE v_product_cash			BIGINT DEFAULT 0;
    DECLARE v_product_buy_qty		INT DEFAULT 0;
    DECLARE v_product_buy_qty_all	INT DEFAULT 0;		-- 전체 구매 수량
	DECLARE v_product_buy_cash		BIGINT DEFAULT 0;
    DECLARE v_product_buy_cash_all	BIGINT DEFAULT 0;	-- 전체 구매 금액
  
	DECLARE done INTEGER DEFAULT 0;	-- 반복문변수선언		
	DECLARE openCursor CURSOR FOR SELECT fld_product_id, fld_product_price FROM _analysis_saleinfo;	-- 커서에 사용할 테이블 선언
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = true;	-- 반복문 핸들러 선언	

  
    IF p_WorldID = 0 THEN
    
    
		OPEN openCursor;	-- 커서 오픈        
			read_loop:LOOP	-- 반복문 시작
				FETCH openCursor INTO v_product_id, v_product_cash;
                
                -- 상품 구매 개수
                SELECT count(*) INTO v_product_buy_qty
				FROM iapdb.tbl_iap
				WHERE pay_complete > 0 AND product_id = v_product_id and DATE(pay_time) = v_date_0;
                
                SET v_product_buy_cash = v_product_cash * v_product_buy_qty;
                
                SET v_product_buy_cash_all = v_product_buy_cash_all + v_product_buy_cash;
                SET v_product_buy_qty_all = v_product_buy_qty_all + v_product_buy_qty;
                
				-- 반복문 종료시 조건
                IF done THEN 
					LEAVE read_loop;
                END IF;
			END LOOP read_loop;	-- 반복문 종료
		CLOSE openCursor;	-- 커서 닫기
               
        
    ELSE
    
		OPEN openCursor;	-- 커서 오픈        
			read_loop:LOOP	-- 반복문 시작
				FETCH openCursor INTO v_product_id, v_product_cash;
                
                -- 상품 구매 개수
				SELECT count(*) INTO v_product_buy_qty
				FROM iapdb.tbl_iap
				WHERE world_idx = p_WorldID AND pay_complete > 0 AND product_id = v_product_id and DATE(pay_time) = v_date_0;
                
                SET v_product_buy_cash = v_product_cash * v_product_buy_qty;
                
                SET v_product_buy_cash_all = v_product_buy_cash_all + v_product_buy_cash;
                SET v_product_buy_qty_all = v_product_buy_qty_all + v_product_buy_qty;
                
				-- 반복문 종료시 조건
                IF done THEN 
					LEAVE read_loop;
                END IF;
			END LOOP read_loop;	-- 반복문 종료
		CLOSE openCursor;	-- 커서 닫기    
         
    END IF;
    
    
    SET p_BuyQty = v_product_buy_qty_all;
    SET p_BuyAmount = v_product_buy_cash_all;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `msp_mmo_event_bitcoin_datas_select` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `msp_mmo_event_bitcoin_datas_select`(
	IN p_AccountID		BIGINT 	-- 계정 고유 번호
,	IN p_StartTime		BIGINT	-- 시작 시간(utc)
,	IN p_EndTime		BIGINT	-- 종료 시간(utc)	
,	IN p_IAPEventType	INT 	-- 결제 이벤트 타입
)
    COMMENT '이벤트 데이터 얻어오기'
BEGIN
	DECLARE v_iap_value 	INT DEFAULT 0;	-- 총 결제 금액(기간내에)

	CALL msp_mmo_iap_event_select(p_AccountID, p_StartTime, p_EndTime, v_iap_value);
	IF 0 < v_iap_value THEN
		INSERT INTO event_bitcoin_datas (account_id, event_type, value, update_date)
			VALUES (p_AccountID, p_IAPEventType, v_iap_value, NOW())
		ON DUPLICATE KEY UPDATE update_date = IF(value <> v_iap_value, now(), update_date), value = v_iap_value;
	END IF;

    SELECT event_type, value 
    FROM event_bitcoin_datas
    WHERE account_id = p_AccountID;
	
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `msp_mmo_event_bitcoin_datas_update` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `msp_mmo_event_bitcoin_datas_update`(
	IN p_AccountID		BIGINT 	-- 계정 고유 번호			
,	IN p_EventType		TINYINT	-- 이벤트 타입
, 	IN p_Condition1		BIGINT 	-- 조건 1
,	IN p_Condition2		BIGINT 	-- 조건 2		
, 	IN p_Value			BIGINT	-- 값
)
    COMMENT '이벤트 데이터 업데이트'
BEGIN
	DECLARE v_nowTime		timestamp DEFAULT NOW();
    
   	root:
	BEGIN
    
		IF 1 = p_EventType THEN
		BEGIN
			-- 전투력 달성
			-- condition1 : 캐릭고유번호
/*			
            INSERT INTO event_bitcoin_datas (account_id, event_type, condition_1, value)
							VALUES (p_AccountID, p_EventType, p_Condition1, p_Value)
			ON DUPLICATE KEY UPDATE `value` = IF(value < p_Value, p_Value, IF(condition_1 = p_Condition1, p_Value, value)), condition_1 = IF(condition_1 <> p_Condition1, p_Condition1, condition_1), update_date = now();
*/            
		END;
		ELSEIF 2 = p_EventType THEN
		BEGIN
			-- 레벨 달성
			-- condition1 : 캐릭고유번호
/*			
            INSERT INTO event_bitcoin_datas (account_id, event_type, condition_1, value)
							VALUES (p_AccountID, p_EventType, p_Condition1, p_Value)
			ON DUPLICATE KEY UPDATE `value` = IF(value < p_Value, p_Value, value), condition_1 = p_Condition1, update_date = now();
*/          
		END;
		ELSEIF 3 = p_EventType THEN
		BEGIN
			-- 럭스 -> 레드루비 교환
            INSERT INTO event_bitcoin_datas (account_id, event_type, value)
							VALUES (p_AccountID, p_EventType, p_Value)
			ON DUPLICATE KEY UPDATE `value` = value + p_Value, update_date = now();			
			
		END;
		ELSEIF 4 = p_EventType THEN
		BEGIN
			-- 접속 시간(초)
            INSERT INTO event_bitcoin_datas (account_id, event_type, value)
							VALUES (p_AccountID, p_EventType, p_Value)
			ON DUPLICATE KEY UPDATE `value` = value + p_Value, update_date = now();
		END;
		END IF;
    
    END;
    
    
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `msp_mmo_iap_event_select` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `msp_mmo_iap_event_select`(
	IN p_AccountID		BIGINT 	-- 계정 고유 번호
,	IN p_StartTime		BIGINT	-- 시작 시간(utc)
,	IN p_EndTime		BIGINT	-- 종료 시간(utc)
,	OUT p_TotalPrice	INT 	-- 구매 금액
)
    COMMENT '기간내 총 결제 금액 얻기'
BEGIN    
	SELECT IFNULL(sum(price), 0) INTO p_TotalPrice FROM (
		SELECT count(C.product_id) * CA.price as price
		FROM w_iapdb.tbl_iap C
			INNER JOIN w_iapdb.tbl_iap_price CA ON C.product_id = CA.product_id AND p_StartTime < UNIX_TIMESTAMP(give_time) AND UNIX_TIMESTAMP(give_time) < p_EndTime
		where account_id = p_AccountID AND give_complete > 1 group by C.product_id
	) A;	
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `msp_tbljcgiapcopy_select` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `msp_tbljcgiapcopy_select`(
)
    COMMENT 'IAP 목록 얻어오기'
BEGIN
	DECLARE v_time_now TIMESTAMP DEFAULT NOW();
    DECLARE v_time_start_date TIMESTAMP;	-- 시작 날짜
	DECLARE v_time_end_date TIMESTAMP;		-- 종료 날짜
    DECLARE v_time_last_date TIMESTAMP;		-- 마지막 업데이트 날짜
    
    DECLARE v_search_start_date TIMESTAMP;	-- 목록 시작 날짜
    DECLARE v_search_end_date TIMESTAMP;	-- 목록 종료 날짜
    DECLARE v_search_time INT DEFAULT 10;		-- 복사하려는 기준 시간(분)
    DECLARE v_next_search_time INT DEFAULT 10;	-- 다음 실행 시간(분)

	root:
    BEGIN
		SELECT iap_copy_start_date, iap_copy_end_date, iap_copy_last_date INTO v_time_start_date, v_time_end_date, v_time_last_date
		FROM tbl_jcg_iap_copy LIMIT 1;
		IF FOUND_ROWS() = 0 THEN
			LEAVE root;
        END IF;

		-- 시작 날짜가 안되었슴
		IF v_time_now < v_time_start_date THEN
			LEAVE root;
        END IF;
        -- 종료 날짜가 지남(목록 주는것 까지 끝남)
        IF v_time_end_date < v_time_now AND v_time_end_date <= v_search_end_date THEN			
			LEAVE root;
        END IF;
        
        -- 시작 날짜 설정
        IF v_time_start_date < v_time_last_date THEN
			SET v_search_start_date = v_time_last_date;
        ELSE
			SET v_search_start_date = v_time_start_date;
        END IF;
        
        -- 종료 날짜 설정
        IF 10 < TIMESTAMPDIFF(MINUTE, v_search_start_date, v_time_now) THEN
			SET v_search_time = 60;		-- 1시간 데이터로 설정
            SET v_next_search_time = 1;	-- 1분후 다시 집계
        END IF;
        
        SET v_search_end_date = DATE_ADD(v_search_start_date, INTERVAL v_search_time MINUTE);
        IF v_time_end_date < v_search_end_date THEN
			SET v_search_end_date = v_time_end_date;	-- 종료 날짜보다 크면 종료 날짜로 고정
        END IF;
		IF v_time_now < v_search_end_date THEN
			SET v_search_end_date = v_time_now;		-- 현재 시간보다 크면 현재 시간으로 고정
        END IF;
        
    
		-- 목록 뽑아냄
        /*
		SELECT txid, account_id, product_id, give_complete, give_time
        FROM tbl_iap ip
        WHERE give_complete > 0 AND v_search_start_date < give_time AND give_time < v_search_end_date;
        */
		SELECT ip.txid, IFNULL(pr.price, 0) as price, UNIX_TIMESTAMP(ip.give_time) AS give_time, IFNULL(ja.wemix_user_address, '') as wemix_user_address
        FROM tbl_iap ip
			INNER JOIN tbl_iap_price pr ON ip.product_id = pr.product_id
			INNER JOIN tbl_jcg_account ja ON ja.account_id = ip.account_id AND ja.reg_date < ip.give_time
        WHERE 0 < give_complete AND v_search_start_date < give_time AND give_time < v_search_end_date;
        
    
		-- 마지막 목록 내려준 날짜 업데이트 해줌
		UPDATE tbl_jcg_iap_copy
		SET iap_copy_last_date = v_search_end_date
        WHERE ID = 0;
    END;
    
    -- 다음 복사 시간 내려줌
    select v_next_search_time, v_time_start_date, v_time_end_date, v_time_last_date, v_search_start_date, v_search_end_date, ID, iap_copy_start_date, iap_copy_end_date, iap_copy_last_date FROM tbl_jcg_iap_copy;
	
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_iap_gamepotsdk_complete_update` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `sp_iap_gamepotsdk_complete_update`(
	IN p_AccountID 		BIGINT			-- 계정 고유 번호
, 	IN p_WorldID		INT				-- 월드 번호
,	IN p_TXID			VARCHAR(128)	-- GAME측 주문 번호
,	IN p_OrderID		VARCHAR(512)	-- SDK측 주문 번호
,	IN p_ProductID		VARCHAR(64)		-- 제품 고유 번호
)
    COMMENT '인앱 구매 완료후 Complete 시작 정보 넣기'
BEGIN
    DECLARE v_errno			INT DEFAULT 0;
	DECLARE v_result		INT DEFAULT 0;
	
    DECLARE v_pay_comlpete	INT DEFAULT 0;
    DECLARE v_give_comlpete	INT DEFAULT 0;
    DECLARE v_product_id	VARCHAR(64) DEFAULT '';	-- 
    
    DECLARE v_world_idx			INT DEFAULT 0;			-- 월드 번호
	DECLARE v_db_idx			INT DEFAULT 0;			-- GAME DB 샤딩 번호
    DECLARE v_account_id		BIGINT DEFAULT 0;		-- 계정 고유 번호
    DECLARE v_user_id			BIGINT DEFAULT 0;		-- 유저 고유 번호
    DECLARE v_first_product		TINYINT DEFAULT 0;    	-- 첫 구매 인지(상품별)
	DECLARE v_first_txid		VARCHAR(128) DEFAULT '';	-- 첫번째 구매 TXID
    
    DECLARE v_first_all			TINYINT DEFAULT 0;		-- 첫 구매 인지(전체)
    
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		GET CURRENT DIAGNOSTICS CONDITION 1
			v_errno = MYSQL_ERRNO;
			SET v_result := (v_errno * -1);
		ROLLBACK;
		        
		SELECT v_result, v_db_idx, v_user_id, v_first_all, v_first_product;
	END;        
        
        
	START TRANSACTION;	
	
	root:
	BEGIN
 
		-- 데이터 확인
        SELECT world_idx, db_idx, account_id, user_id, product_id, pay_complete, give_complete INTO v_world_idx, v_db_idx, v_account_id, v_user_id, v_product_id, v_pay_comlpete, v_give_comlpete 
        FROM tbl_iap
        WHERE txid = p_TXID;
        
        IF FOUND_ROWS() = 0 THEN
			SET v_result = 101;		-- 예약 데이터 없슴
			LEAVE root;
        END IF;
		
		IF p_AccountID <> v_account_id THEN
			SET v_result = 106;		-- 잘못된 계정 정보
			LEAVE root;
		END IF;
        
        -- 처리 중 OR 처리 완료 확인(0 일 경우만 처리해야함)
        IF v_give_comlpete <> 0 THEN
			IF v_give_comlpete = 1 THEN
				SET v_result = 102;		-- Complete 처리중
				LEAVE root;
            END IF;
            
			IF v_give_comlpete = 2 THEN
				SET v_result = 103;		-- Complete 완료
				LEAVE root;
            END IF;
            
            SET v_result = 104;		-- Invalid 값
            LEAVE root;
        END IF;
        
        -- 영수증 중복 확인
        IF EXISTS (SELECT * FROM tbl_iap WHERE receipt = p_OrderID) THEN
			SET v_result = 105;		-- 영수증 중복
			LEAVE root;
        END IF;
        

		-- Complete 시작
		UPDATE tbl_iap
		SET receipt = p_OrderID, pay_complete = 1, pay_time = NOW(), give_complete = 1
		WHERE txid = p_TXID AND user_id = v_user_id;

		IF ROW_COUNT() <> 1 THEN
			SET v_result = 105;		-- 시작 실패
            LEAVE root;
		END IF;



		/*
			이벤트 데이터 추출
		*/ 
        
		-- 첫구매(전체)
		SELECT txid INTO v_first_txid
        FROM tbl_iap
        WHERE user_id = v_user_id AND 0 < pay_complete 
        ORDER BY txid_time LIMIT 1;
        
        IF v_first_txid = p_TXID THEN
			SET v_first_all = 1;		-- 첫구매임..
            SET v_first_txid = '';
        END IF;        
        
		-- 첫구매(상품별)
		SELECT txid INTO v_first_txid
        FROM tbl_iap
        WHERE user_id = v_user_id AND product_id = v_product_id AND 0 < pay_complete 
        ORDER BY txid_time LIMIT 1;
        
        IF v_first_txid = p_TXID THEN
			SET v_first_product = 1;	-- 첫구매임..
            SET v_first_txid = '';
        END IF;
	END;
	
	IF v_result != 0 THEN
		ROLLBACK;
	ELSE
		COMMIT;
	END IF;	
	
    SELECT v_result, v_db_idx, v_user_id, v_first_all, v_first_product;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_iap_gamepotsdk_complete_update_finish` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `sp_iap_gamepotsdk_complete_update_finish`(
	IN p_UserID		BIGINT				-- 유저 고유 번호
,	IN p_TXID		VARCHAR(128)		-- 예약 트랜잭션 ID
)
    COMMENT '게임측 에러로 롤백'
BEGIN
    DECLARE v_errno			INT DEFAULT 0;
	DECLARE v_result		INT DEFAULT 0;
	
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		GET CURRENT DIAGNOSTICS CONDITION 1
			v_errno = MYSQL_ERRNO;
			SET v_result := (v_errno * -1);
		ROLLBACK;
		        
		SELECT v_result;
	END; 
    
    
	-- Complete 완료
	UPDATE tbl_iap
	SET give_complete = 2, give_time = NOW()
	WHERE txid = p_TXID AND user_id = p_UserID;

	IF ROW_COUNT() <> 1 THEN
		SET v_result = 101;		-- 완료 실패
	END IF;        
	
    
    SELECT v_result;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_iap_gamepotsdk_complete_update_rollback` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `sp_iap_gamepotsdk_complete_update_rollback`(
	IN p_TXID			VARCHAR(128)	-- GAME측 주문 번호
)
    COMMENT '게임측 에러로 롤백'
BEGIN
    DECLARE v_errno			INT DEFAULT 0;
	DECLARE v_result		INT DEFAULT 0;
	
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		GET CURRENT DIAGNOSTICS CONDITION 1
			v_errno = MYSQL_ERRNO;
			SET v_result := (v_errno * -1);
		ROLLBACK;
		        
		SELECT v_result;
	END; 
    
    
	-- Complete 롤백
	UPDATE tbl_iap
	SET give_complete = 0
	WHERE txid = p_TXID;

	IF ROW_COUNT() <> 1 THEN
		SET v_result = 101;		-- 롤백 실패
	END IF;        
	
    
    SELECT v_result;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_iap_stormsdk_complete_update` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `sp_iap_stormsdk_complete_update`(
	IN p_AccountID 		BIGINT			-- 계정 고유 번호
,	IN p_UserID			BIGINT			-- 월드 계정 고유 번호
, 	IN p_WorldID		INT				-- 월드 번호
,	IN p_TXID			VARCHAR(128)	-- GAME측 주문 번호
,	IN p_Receipt		VARCHAR(512)	-- 영수증
,	IN p_ProductID		VARCHAR(64)		-- 제품 고유 번호
)
    COMMENT '인앱 구매 완료후 Complete 시작 정보 넣기, 수동이므로 예약 정보도 동시에 넣어야 한다'
BEGIN
    DECLARE v_errno			INT DEFAULT 0;
	DECLARE v_result		INT DEFAULT 0;
	
    DECLARE v_pay_comlpete	INT DEFAULT 0;
    DECLARE v_give_comlpete	INT DEFAULT 0;
    DECLARE v_product_id	VARCHAR(64) DEFAULT '';	-- 
    
    DECLARE v_first_product		TINYINT DEFAULT 0;    	-- 첫 구매 인지(상품별)
	DECLARE v_first_txid		VARCHAR(128) DEFAULT '';	-- 첫번째 구매 TXID
    
    DECLARE v_first_all			TINYINT DEFAULT 0;		-- 첫 구매 인지(전체)
    
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		GET CURRENT DIAGNOSTICS CONDITION 1
			v_errno = MYSQL_ERRNO;
			SET v_result := (v_errno * -1);
		ROLLBACK;
		        
		SELECT v_result, v_first_all, v_first_product;
	END;        
        
        
	START TRANSACTION;	
	
	root:
	BEGIN

        -- TXID 중복 확인
        IF EXISTS (SELECT * FROM tbl_iap WHERE txid = p_TXID LIMIT 1) THEN
			SET v_result = 101;		-- TXID 중복
			LEAVE root;
		END IF;
        
        -- 영수증 중복 확인
        IF EXISTS (SELECT * FROM tbl_iap WHERE receipt = p_Receipt) THEN
			SET v_result = 102;		-- 영수증 중복
			LEAVE root;
        END IF;        

		-- Complete 시작
        INSERT INTO tbl_iap (txid, txid_time, receipt, world_idx, db_idx, account_id, user_id, char_id, product_id, pay_complete, pay_time, give_complete, give_time)
        VALUES(p_TXID, NOW(), p_Receipt, p_WorldID, 1, p_AccountID, p_UserID, 0, p_ProductID, 1, NOW(), 1, NOW());

		IF ROW_COUNT() <> 1 THEN
			SET v_result = 103;		-- 시작 실패
            LEAVE root;
		END IF;


		/*
			이벤트 데이터 추출
		*/ 
        
		-- 첫구매(전체)
		SELECT txid INTO v_first_txid
        FROM tbl_iap
        WHERE user_id = p_UserID AND 0 < pay_complete 
        ORDER BY txid_time LIMIT 1;
        
        IF v_first_txid = p_TXID THEN
			SET v_first_all = 1;		-- 첫구매임..
            SET v_first_txid = '';
        END IF;        
        
		-- 첫구매(상품별)
		SELECT txid INTO v_first_txid
        FROM tbl_iap
        WHERE user_id = p_UserID AND product_id = p_ProductID AND 0 < pay_complete 
        ORDER BY txid_time LIMIT 1;
        
        IF v_first_txid = p_TXID THEN
			SET v_first_product = 1;	-- 첫구매임..
            SET v_first_txid = '';
        END IF;
	END;
	
	IF v_result != 0 THEN
		ROLLBACK;
	ELSE
		COMMIT;
	END IF;	
	
    SELECT v_result, v_first_all, v_first_product;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tsp_cashbcontroldata_select` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `tsp_cashbcontroldata_select`(
 	IN p_WorldID		INT		-- 월드 번호
,	IN p_UpdateKey		INT		-- uPDATE KEY
)
    COMMENT 'CashB 제어 데이터 읽어오기, 서버 구동시'
BEGIN
	-- 전체 월드 데이터를 읽어온다
	SELECT update_key, world_id, cashb_qty
	FROM cashb_control_data_game
    WHERE update_key = p_UpdateKey;
    
    -- 월드별 개별 데이터를 읽어온다
    SELECT update_key, cashb_type, cashb_subtype, cashb_qty
    FROM cashb_control_data_world
    WHERE update_key = p_UpdateKey AND world_id = p_WorldID;    
    
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tsp_cashbcontroldata_update` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `tsp_cashbcontroldata_update`(
 	IN p_WorldID			INT		-- 월드 번호
,	IN p_UpdateKey			INT		-- uPDATE KEY
, 	IN p_CashBType			INT 	-- TYPE
, 	IN p_CashBSubType		INT		-- 보조 Type
,	IN p_DropCashB			BIGINT	-- 드랍된 CashB 수량
,	IN p_CashBTypeMax		BIGINT 	-- 해당 Type(+SubType)의 드랍 가능한 최대 수량
,	IN p_CashBWorldMax		BIGINT	-- 해당 월드의 최대 드랍 가능 수량
)
    COMMENT 'Drop한 CashB 수량 제어 처리'
BEGIN
    DECLARE v_errno			INT DEFAULT 0;
	DECLARE v_result		INT DEFAULT 0;
    
    DECLARE v_game_cashb_qty 	BIGINT DEFAULT 0;	-- 전체 게임에서 나온 수량
    DECLARE v_world_cashb_qty 	BIGINT DEFAULT p_DropCashB;	-- 해당 월드에서 나온 수량
    DECLARE v_type_cashb_qty 	BIGINT DEFAULT p_DropCashB;	-- 해당 월드 타입에서 나온 수량 
  
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		GET CURRENT DIAGNOSTICS CONDITION 1
			v_errno = MYSQL_ERRNO;
			SET v_result := (v_errno * -1);
		ROLLBACK;
		        
		SELECT v_result, v_game_cashb_qty, v_world_cashb_qty, v_type_cashb_qty;
	END;        
        
	
	root:
	BEGIN    
		-- 월드별 수량 처리
        INSERT INTO cashb_control_data_game(update_key, world_id, cashb_qty, cashb_qty_max, data_date)
			VALUES (p_UpdateKey, p_WorldID, p_DropCashB, p_CashBWorldMax, NOW())
		ON DUPLICATE KEY UPDATE cashb_qty = (@v_world_cashb_qty := cashb_qty + p_DropCashB), data_date = NOW();
        
        IF ROW_COUNT() = 2 THEN
			SET v_world_cashb_qty = @v_world_cashb_qty;
		END IF;
        
        SELECT sum(cashb_qty) INTO v_game_cashb_qty
        FROM cashb_control_data_game 
        WHERE update_key = p_UpdateKey;
        
        -- 월드 type 별 수량 처리
        INSERT INTO cashb_control_data_world(update_key, world_id, cashb_type, cashb_subtype, cashb_qty, cashb_qty_max, data_date)
			VALUES (p_UpdateKey, p_WorldID, p_CashBType, p_CashBSubType, p_DropCashB, p_CashBTypeMax, NOW())
		ON DUPLICATE KEY UPDATE cashb_qty = (@v_world_cashb_qty := cashb_qty + p_DropCashB), data_date = NOW();
        
        IF ROW_COUNT() = 2 THEN
			SET v_type_cashb_qty = @v_world_cashb_qty;
		END IF;                
	END;

    SELECT v_result, v_game_cashb_qty, v_world_cashb_qty, v_type_cashb_qty;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tsp_mmo_usercouponused_update_status` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `tsp_mmo_usercouponused_update_status`(
	IN 	p_UserID			BIGINT		
,	IN 	p_CouponID			VARCHAR(20)	
)
    COMMENT '쿠폰 지급 완료 처리'
BEGIN
    DECLARE v_errno			INT DEFAULT 0;
	DECLARE v_result 		INT DEFAULT 0;
    
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		GET CURRENT DIAGNOSTICS CONDITION 1
			v_errno = MYSQL_ERRNO;
			SET v_result := (v_errno * -1);
		
		SELECT v_result;
	END;        
	
	UPDATE user_coupon_used
	SET status = 1
	WHERE coupon_id = p_CouponID AND user_idx = p_UserID;   

	IF 0 = ROW_COUNT() THEN
		SET v_result = 101;
	END IF;

	SELECT v_result;
    
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tsp_mmo_usercoupon_fail_inc` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `tsp_mmo_usercoupon_fail_inc`( 
	IN 	p_UserID 		BIGINT		-- 계정 고유 번호
,	OUT	v_FailCnt		SMALLINT 	-- 누적 실패 횟수		
)
    COMMENT '쿠폰입력 실패'
BEGIN
	SET v_FailCnt = 1;
    SET @fail_cnt = 1;

	INSERT INTO user_coupon_fail (user_idx, fail_cnt)
		VALUES(p_UserID, 1)
	ON DUPLICATE KEY UPDATE fail_cnt = @fail_cnt := fail_cnt + 1, update_time = now();
    
    SET v_FailCnt = @fail_cnt;
   
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tsp_mmo_usercoupon_insert_new` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `tsp_mmo_usercoupon_insert_new`(
	IN 	p_CouponType		INT 	
,	IN 	p_AddQty			TINYINT		
,	IN 	p_CouponID_1		VARCHAR(20)	
,	IN 	p_CouponID_2		VARCHAR(20)	
,	IN 	p_CouponID_3		VARCHAR(20)	
,	IN 	p_CouponID_4		VARCHAR(20)	
,	IN 	p_CouponID_5		VARCHAR(20)	
,	IN 	p_CouponID_6		VARCHAR(20)	
,	IN 	p_CouponID_7		VARCHAR(20)	
,	IN 	p_CouponID_8		VARCHAR(20)	
,	IN 	p_CouponID_9		VARCHAR(20)	
,	IN 	p_CouponID_10		VARCHAR(20)	
,	IN 	p_CouponID_11		VARCHAR(20)	
,	IN 	p_CouponID_12		VARCHAR(20)	
,	IN 	p_CouponID_13		VARCHAR(20)	
,	IN 	p_CouponID_14		VARCHAR(20)	
,	IN 	p_CouponID_15		VARCHAR(20)	
,	IN 	p_CouponID_16		VARCHAR(20)	
,	IN 	p_CouponID_17		VARCHAR(20)	
,	IN 	p_CouponID_18		VARCHAR(20)	
,	IN 	p_CouponID_19		VARCHAR(20)	
,	IN 	p_CouponID_20		VARCHAR(20)	
,	IN 	p_CouponID_21		VARCHAR(20)	
,	IN 	p_CouponID_22		VARCHAR(20)	
,	IN 	p_CouponID_23		VARCHAR(20)	
,	IN 	p_CouponID_24		VARCHAR(20)	
,	IN 	p_CouponID_25		VARCHAR(20)	
,	IN 	p_CouponID_26		VARCHAR(20)	
,	IN 	p_CouponID_27		VARCHAR(20)	
,	IN 	p_CouponID_28		VARCHAR(20)	
,	IN 	p_CouponID_29		VARCHAR(20)	
,	IN 	p_CouponID_30		VARCHAR(20)	
,	IN 	p_CouponID_31		VARCHAR(20)	
,	IN 	p_CouponID_32		VARCHAR(20)	
,	IN 	p_CouponID_33		VARCHAR(20)	
,	IN 	p_CouponID_34		VARCHAR(20)	
,	IN 	p_CouponID_35		VARCHAR(20)	
,	IN 	p_CouponID_36		VARCHAR(20)	
,	IN 	p_CouponID_37		VARCHAR(20)	
,	IN 	p_CouponID_38		VARCHAR(20)	
,	IN 	p_CouponID_39		VARCHAR(20)	
,	IN 	p_CouponID_40		VARCHAR(20)	
,	IN 	p_CouponID_41		VARCHAR(20)	
,	IN 	p_CouponID_42		VARCHAR(20)	
,	IN 	p_CouponID_43		VARCHAR(20)	
,	IN 	p_CouponID_44		VARCHAR(20)	
,	IN 	p_CouponID_45		VARCHAR(20)	
,	IN 	p_CouponID_46		VARCHAR(20)	
,	IN 	p_CouponID_47		VARCHAR(20)	
,	IN 	p_CouponID_48		VARCHAR(20)	
,	IN 	p_CouponID_49		VARCHAR(20)	
,	IN 	p_CouponID_50		VARCHAR(20)	
)
BEGIN
    DECLARE v_errno			INT DEFAULT 0;
	DECLARE v_result 		INT DEFAULT 0;
    DECLARE v_qty			INT DEFAULT 0;
    DECLARE v_callqty		INT DEFAULT 0;

	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		GET CURRENT DIAGNOSTICS CONDITION 1
			v_errno = MYSQL_ERRNO;
			SET v_result := (v_errno * -1);
		ROLLBACK;
		
		SELECT v_result, v_qty;
	END;        
    
    IF p_AddQty = 50 THEN

		INSERT INTO user_coupon (coupon_id, coupon_type) VALUES(p_CouponID_1, p_CouponType), (p_CouponID_2, p_CouponType), (p_CouponID_3, p_CouponType), (p_CouponID_4, p_CouponType), (p_CouponID_5, p_CouponType),
															(p_CouponID_6, p_CouponType), (p_CouponID_7, p_CouponType), (p_CouponID_8, p_CouponType), (p_CouponID_9, p_CouponType), (p_CouponID_10, p_CouponType),
                                                            (p_CouponID_11, p_CouponType), (p_CouponID_12, p_CouponType), (p_CouponID_13, p_CouponType), (p_CouponID_14, p_CouponType), (p_CouponID_15, p_CouponType),
															(p_CouponID_16, p_CouponType), (p_CouponID_17, p_CouponType), (p_CouponID_18, p_CouponType), (p_CouponID_19, p_CouponType), (p_CouponID_20, p_CouponType),
                                                            (p_CouponID_21, p_CouponType), (p_CouponID_22, p_CouponType), (p_CouponID_23, p_CouponType), (p_CouponID_24, p_CouponType), (p_CouponID_25, p_CouponType),
															(p_CouponID_26, p_CouponType), (p_CouponID_27, p_CouponType), (p_CouponID_28, p_CouponType), (p_CouponID_29, p_CouponType), (p_CouponID_30, p_CouponType),
                                                            (p_CouponID_31, p_CouponType), (p_CouponID_32, p_CouponType), (p_CouponID_33, p_CouponType), (p_CouponID_34, p_CouponType), (p_CouponID_35, p_CouponType),
															(p_CouponID_36, p_CouponType), (p_CouponID_37, p_CouponType), (p_CouponID_38, p_CouponType), (p_CouponID_39, p_CouponType), (p_CouponID_40, p_CouponType),
                                                            (p_CouponID_41, p_CouponType), (p_CouponID_42, p_CouponType), (p_CouponID_43, p_CouponType), (p_CouponID_44, p_CouponType), (p_CouponID_45, p_CouponType),
															(p_CouponID_46, p_CouponType), (p_CouponID_47, p_CouponType), (p_CouponID_48, p_CouponType), (p_CouponID_49, p_CouponType), (p_CouponID_50, p_CouponType);

		SET v_qty = v_qty + ROW_COUNT();
    
	ELSE
    BEGIN
    
		IF(p_CouponID_1 <> '') THEN
			call tsp_mmo_usercoupon_insert(p_CouponType, p_CouponID_1, v_callqty);
            SET v_qty = v_qty + v_callqty;
		END IF;
		IF(p_CouponID_2 <> '') THEN
			call tsp_mmo_usercoupon_insert(p_CouponType, p_CouponID_2, v_callqty);
            SET v_qty = v_qty + v_callqty;            
		END IF;    
		IF(p_CouponID_3 <> '') THEN
			call tsp_mmo_usercoupon_insert(p_CouponType, p_CouponID_3, v_callqty);
            SET v_qty = v_qty + v_callqty;
		END IF;    
		IF(p_CouponID_4 <> '') THEN
			call tsp_mmo_usercoupon_insert(p_CouponType, p_CouponID_4, v_callqty);
            SET v_qty = v_qty + v_callqty;
		END IF;    
		IF(p_CouponID_5 <> '') THEN
			call tsp_mmo_usercoupon_insert(p_CouponType, p_CouponID_5, v_callqty);
            SET v_qty = v_qty + v_callqty;
		END IF;    
		IF(p_CouponID_6 <> '') THEN
			call tsp_mmo_usercoupon_insert(p_CouponType, p_CouponID_6, v_callqty);
            SET v_qty = v_qty + v_callqty;
		END IF;    
		IF(p_CouponID_7 <> '') THEN
			call tsp_mmo_usercoupon_insert(p_CouponType, p_CouponID_7, v_callqty);
            SET v_qty = v_qty + v_callqty;
		END IF;    
		IF(p_CouponID_8 <> '') THEN
			call tsp_mmo_usercoupon_insert(p_CouponType, p_CouponID_8, v_callqty);
            SET v_qty = v_qty + v_callqty;
		END IF;    
		IF(p_CouponID_9 <> '') THEN
			call tsp_mmo_usercoupon_insert(p_CouponType, p_CouponID_9, v_callqty);
            SET v_qty = v_qty + v_callqty;
		END IF;    
		IF(p_CouponID_10 <> '') THEN
			call tsp_mmo_usercoupon_insert(p_CouponType, p_CouponID_10, v_callqty);
            SET v_qty = v_qty + v_callqty;
		END IF;    
		IF(p_CouponID_11 <> '') THEN
			call tsp_mmo_usercoupon_insert(p_CouponType, p_CouponID_11, v_callqty);
            SET v_qty = v_qty + v_callqty;
		END IF;
		IF(p_CouponID_12 <> '') THEN
			call tsp_mmo_usercoupon_insert(p_CouponType, p_CouponID_12, v_callqty);
            SET v_qty = v_qty + v_callqty;
		END IF;    
		IF(p_CouponID_13 <> '') THEN
			call tsp_mmo_usercoupon_insert(p_CouponType, p_CouponID_13, v_callqty);
            SET v_qty = v_qty + v_callqty;
		END IF;    
		IF(p_CouponID_14 <> '') THEN
			call tsp_mmo_usercoupon_insert(p_CouponType, p_CouponID_14, v_callqty);
            SET v_qty = v_qty + v_callqty;
		END IF;    
		IF(p_CouponID_15 <> '') THEN
			call tsp_mmo_usercoupon_insert(p_CouponType, p_CouponID_15, v_callqty);
            SET v_qty = v_qty + v_callqty;
		END IF;    
		IF(p_CouponID_16 <> '') THEN
			call tsp_mmo_usercoupon_insert(p_CouponType, p_CouponID_16, v_callqty);
            SET v_qty = v_qty + v_callqty;
		END IF;    
		IF(p_CouponID_17 <> '') THEN
			call tsp_mmo_usercoupon_insert(p_CouponType, p_CouponID_17, v_callqty);
            SET v_qty = v_qty + v_callqty;
		END IF;    
		IF(p_CouponID_18 <> '') THEN
			call tsp_mmo_usercoupon_insert(p_CouponType, p_CouponID_18, v_callqty);
            SET v_qty = v_qty + v_callqty;
		END IF;    
		IF(p_CouponID_19 <> '') THEN
			call tsp_mmo_usercoupon_insert(p_CouponType, p_CouponID_19, v_callqty);
            SET v_qty = v_qty + v_callqty;
		END IF;    
		IF(p_CouponID_20 <> '') THEN
			call tsp_mmo_usercoupon_insert(p_CouponType, p_CouponID_20, v_callqty);
            SET v_qty = v_qty + v_callqty;
		END IF; 	
		IF(p_CouponID_21 <> '') THEN
			call tsp_mmo_usercoupon_insert(p_CouponType, p_CouponID_21, v_callqty);
            SET v_qty = v_qty + v_callqty;
		END IF;
		IF(p_CouponID_22 <> '') THEN
			call tsp_mmo_usercoupon_insert(p_CouponType, p_CouponID_22, v_callqty);
            SET v_qty = v_qty + v_callqty;
		END IF;    
		IF(p_CouponID_23 <> '') THEN
			call tsp_mmo_usercoupon_insert(p_CouponType, p_CouponID_23, v_callqty);
            SET v_qty = v_qty + v_callqty;
		END IF;    
		IF(p_CouponID_24 <> '') THEN
			call tsp_mmo_usercoupon_insert(p_CouponType, p_CouponID_24, v_callqty);
            SET v_qty = v_qty + v_callqty;
		END IF;    
		IF(p_CouponID_25 <> '') THEN
			call tsp_mmo_usercoupon_insert(p_CouponType, p_CouponID_25, v_callqty);
            SET v_qty = v_qty + v_callqty;
		END IF;    
		IF(p_CouponID_26 <> '') THEN
			call tsp_mmo_usercoupon_insert(p_CouponType, p_CouponID_26, v_callqty);
            SET v_qty = v_qty + v_callqty;
		END IF;    
		IF(p_CouponID_27 <> '') THEN
			call tsp_mmo_usercoupon_insert(p_CouponType, p_CouponID_27, v_callqty);
            SET v_qty = v_qty + v_callqty;
		END IF;    
		IF(p_CouponID_28 <> '') THEN
			call tsp_mmo_usercoupon_insert(p_CouponType, p_CouponID_28, v_callqty);
            SET v_qty = v_qty + v_callqty;
		END IF;    
		IF(p_CouponID_29 <> '') THEN
			call tsp_mmo_usercoupon_insert(p_CouponType, p_CouponID_29, v_callqty);
            SET v_qty = v_qty + v_callqty;
		END IF;    
		IF(p_CouponID_30 <> '') THEN
			call tsp_mmo_usercoupon_insert(p_CouponType, p_CouponID_30, v_callqty);
            SET v_qty = v_qty + v_callqty;
		END IF; 	
		IF(p_CouponID_31 <> '') THEN
			call tsp_mmo_usercoupon_insert(p_CouponType, p_CouponID_31, v_callqty);
            SET v_qty = v_qty + v_callqty;
		END IF;
		IF(p_CouponID_32 <> '') THEN
			call tsp_mmo_usercoupon_insert(p_CouponType, p_CouponID_32, v_callqty);
            SET v_qty = v_qty + v_callqty;
		END IF;    
		IF(p_CouponID_33 <> '') THEN
			call tsp_mmo_usercoupon_insert(p_CouponType, p_CouponID_33, v_callqty);
            SET v_qty = v_qty + v_callqty;
		END IF;    
		IF(p_CouponID_34 <> '') THEN
			call tsp_mmo_usercoupon_insert(p_CouponType, p_CouponID_34, v_callqty);
            SET v_qty = v_qty + v_callqty;
		END IF;    
		IF(p_CouponID_35 <> '') THEN
			call tsp_mmo_usercoupon_insert(p_CouponType, p_CouponID_35, v_callqty);
            SET v_qty = v_qty + v_callqty;
		END IF;    
		IF(p_CouponID_36 <> '') THEN
			call tsp_mmo_usercoupon_insert(p_CouponType, p_CouponID_36, v_callqty);
            SET v_qty = v_qty + v_callqty;
		END IF;    
		IF(p_CouponID_37 <> '') THEN
			call tsp_mmo_usercoupon_insert(p_CouponType, p_CouponID_37, v_callqty);
            SET v_qty = v_qty + v_callqty;
		END IF;    
		IF(p_CouponID_38 <> '') THEN
			call tsp_mmo_usercoupon_insert(p_CouponType, p_CouponID_38, v_callqty);
            SET v_qty = v_qty + v_callqty;
		END IF;    
		IF(p_CouponID_39 <> '') THEN
			call tsp_mmo_usercoupon_insert(p_CouponType, p_CouponID_39, v_callqty);
            SET v_qty = v_qty + v_callqty;
		END IF;    
		IF(p_CouponID_40 <> '') THEN
			call tsp_mmo_usercoupon_insert(p_CouponType, p_CouponID_40, v_callqty);
            SET v_qty = v_qty + v_callqty;
		END IF; 	
		IF(p_CouponID_41 <> '') THEN
			call tsp_mmo_usercoupon_insert(p_CouponType, p_CouponID_41, v_callqty);
            SET v_qty = v_qty + v_callqty;
		END IF;
		IF(p_CouponID_42 <> '') THEN
			call tsp_mmo_usercoupon_insert(p_CouponType, p_CouponID_42, v_callqty);
            SET v_qty = v_qty + v_callqty;
		END IF;    
		IF(p_CouponID_43 <> '') THEN
			call tsp_mmo_usercoupon_insert(p_CouponType, p_CouponID_43, v_callqty);
            SET v_qty = v_qty + v_callqty;
		END IF;    
		IF(p_CouponID_44 <> '') THEN
			call tsp_mmo_usercoupon_insert(p_CouponType, p_CouponID_44, v_callqty);
            SET v_qty = v_qty + v_callqty;
		END IF;    
		IF(p_CouponID_45 <> '') THEN
			call tsp_mmo_usercoupon_insert(p_CouponType, p_CouponID_45, v_callqty);
            SET v_qty = v_qty + v_callqty;
		END IF;    
		IF(p_CouponID_46 <> '') THEN
			call tsp_mmo_usercoupon_insert(p_CouponType, p_CouponID_46, v_callqty);
            SET v_qty = v_qty + v_callqty;
		END IF;    
		IF(p_CouponID_47 <> '') THEN
			call tsp_mmo_usercoupon_insert(p_CouponType, p_CouponID_47, v_callqty);
            SET v_qty = v_qty + v_callqty;
		END IF;    
		IF(p_CouponID_48 <> '') THEN
			call tsp_mmo_usercoupon_insert(p_CouponType, p_CouponID_48, v_callqty);
            SET v_qty = v_qty + v_callqty;
		END IF;    
		IF(p_CouponID_49 <> '') THEN
			call tsp_mmo_usercoupon_insert(p_CouponType, p_CouponID_49, v_callqty);
            SET v_qty = v_qty + v_callqty;
		END IF;    
		IF(p_CouponID_50 <> '') THEN
			call tsp_mmo_usercoupon_insert(p_CouponType, p_CouponID_50, v_callqty);
            SET v_qty = v_qty + v_callqty;
		END IF; 	    
    
    END;
    END IF;



	
	SELECT v_result, v_qty;
    
    
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tsp_mmo_usercoupon_select_info` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `tsp_mmo_usercoupon_select_info`(
	IN 	p_WorldID			INT			
,	IN 	p_UserID			BIGINT		
,	IN 	p_CouponID			VARCHAR(20)	
)
BEGIN
    DECLARE v_errno			INT DEFAULT 0;
	DECLARE v_result 		INT DEFAULT 0;
    
    DECLARE v_coupon_type			INT DEFAULT 0;
    DECLARE v_coupon_use_type		TINYINT DEFAULT 0;		
	DECLARE v_start_time			TIMESTAMP DEFAULT NOW();	
    DECLARE v_expire_time			TIMESTAMP DEFAULT NOW();	
	DECLARE v_use_type 				TINYINT DEFAULT 0;
	DECLARE v_post_sender_name 		VARCHAR(64) DEFAULT '';
	DECLARE v_post_content 			VARCHAR(128) DEFAULT '';
	DECLARE v_post_text_id 			SMALLINT DEFAULT 0;
	DECLARE v_post_keep_day 		SMALLINT DEFAULT 0;
	DECLARE v_reward_gold 			BIGINT DEFAULT 0;
	DECLARE v_reward_greenruby 		BIGINT DEFAULT 0;
	DECLARE v_reward_redruby 		BIGINT DEFAULT 0;
	DECLARE v_reward_item_1_type 	TINYINT DEFAULT 0;
	DECLARE v_reward_item_1_id 		INT DEFAULT 0;
	DECLARE v_reward_item_1_qty 	INT DEFAULT 0;
	DECLARE v_reward_item_2_type 	TINYINT DEFAULT 0;
	DECLARE v_reward_item_2_id 		INT DEFAULT 0;
	DECLARE v_reward_item_2_qty 	INT DEFAULT 0;
	DECLARE v_reward_item_3_type 	TINYINT DEFAULT 0;
	DECLARE v_reward_item_3_id 		INT DEFAULT 0;
	DECLARE v_reward_item_3_qty 	INT DEFAULT 0;
	DECLARE v_reward_item_4_type 	TINYINT DEFAULT 0;
	DECLARE v_reward_item_4_id 		INT DEFAULT 0;
	DECLARE v_reward_item_4_qty 	INT DEFAULT 0;
	DECLARE v_reward_item_5_type 	TINYINT DEFAULT 0;
	DECLARE v_reward_item_5_id 		INT DEFAULT 0;
	DECLARE v_reward_item_5_qty 	INT DEFAULT 0;
    DECLARE v_fail_count			SMALLINT DEFAULT 0;
    
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		GET CURRENT DIAGNOSTICS CONDITION 1
			v_errno = MYSQL_ERRNO;
			SET v_result := (v_errno * -1);
		ROLLBACK;
		
		SELECT v_result, v_fail_count;
	END;        
    
	
	START TRANSACTION;	
	
	root:
	BEGIN    
		
		SELECT coupon_type INTO v_coupon_type
        FROM user_coupon
        WHERE coupon_id = p_CouponID;
        
        IF found_rows() = 0 THEN
			SET v_result = 101;	
            LEAVE root;
        END IF;
        
        
		SELECT use_type, start_time, expire_time, use_type, post_sender_name, post_content, post_text_id, post_keep_day, reward_gold, reward_greenruby, reward_redruby, 
				reward_item_1_type, reward_item_1_id, reward_item_1_qty, reward_item_2_type, reward_item_2_id, reward_item_2_qty, 
				reward_item_3_type, reward_item_3_id, reward_item_3_qty, reward_item_4_type, reward_item_4_id, reward_item_4_qty, 
				reward_item_5_type, reward_item_5_id, reward_item_5_qty
        INTO v_coupon_use_type, v_start_time, v_expire_time, v_use_type, v_post_sender_name, v_post_content, v_post_text_id, v_post_keep_day, v_reward_gold, v_reward_greenruby, v_reward_redruby ,
				v_reward_item_1_type, v_reward_item_1_id, v_reward_item_1_qty, v_reward_item_2_type, v_reward_item_2_id, v_reward_item_2_qty, 
				v_reward_item_3_type, v_reward_item_3_id, v_reward_item_3_qty, v_reward_item_4_type, v_reward_item_4_id, v_reward_item_4_qty, 
				v_reward_item_5_type, v_reward_item_5_id, v_reward_item_5_qty        
        FROM user_coupon_type
        WHERE type_id = v_coupon_type;
        
        IF found_rows() = 0 THEN
			SET v_result = 102;	
            LEAVE root;
        END IF;
        
        
        IF now() < v_start_time THEN
			SET v_result = 103;	
            LEAVE root;
        END IF;
        IF v_expire_time < now() THEN
			SET v_result = 104;	
            LEAVE root;
        END IF;
        
    
        
        IF 0 = v_coupon_use_type THEN
        BEGIN
			-- 단수 쿠폰(쿠폰 번호 체크)
			IF EXISTS( SELECT user_idx FROM user_coupon_used WHERE coupon_id = p_CouponID ) THEN
				SET v_result = 105;		-- 이미 사용된 쿠폰임	
				LEAVE root;
			END IF;            
		END;
		ELSEIF 1 = v_coupon_use_type THEN
        BEGIN
			-- 복수 쿠폰(계정의 쿠폰번호 체크)
			IF EXISTS( SELECT user_idx FROM user_coupon_used WHERE user_idx = p_UserID AND coupon_id = p_CouponID ) THEN
				SET v_result = 106;		-- 해당 계정에서 이미 사용한 쿠폰임
				LEAVE root;
			END IF;            
        END;
		ELSEIF 2 = v_coupon_use_type THEN
        BEGIN
			-- 단수 쿠폰(쿠폰 번호 체크)
			IF EXISTS( SELECT user_idx FROM user_coupon_used WHERE coupon_id = p_CouponID ) THEN            
				SET v_result = 105;		-- 이미 사용된 쿠폰임
				LEAVE root;
			END IF;
		
			-- 같은 타입 체크 쿠폰(계정당 이 타입의 쿠폰은 한번만 가능)
			IF EXISTS( SELECT user_idx FROM user_coupon_used C INNER JOIN user_coupon CA ON C.coupon_id = CA.coupon_id AND CA.coupon_type = v_coupon_type WHERE C.user_idx = p_UserID ) THEN
				SET v_result = 109;		-- 해당 계정에서 이 타입의 쿠폰을 이미 사용했슴(1번만 사용가능, 쿠폰번호가 달라도 타입이 같은것은 한번만 가능)
				LEAVE root;
			END IF;
			
        END;		
        ELSE
			
			SET v_result = 107;		
			LEAVE root;
        END IF;
        
        
        INSERT INTO user_coupon_used(`coupon_id`, `user_idx`, `status`, `use_time`)
        VALUES (p_CouponID, p_UserID, 0, NOW());
        
		IF ROW_COUNT() <= 0 THEN
			SET v_result = 108;		
            LEAVE root;
        END IF;

    END;
    
	
	IF 0 = v_result THEN
		COMMIT;
	ELSE
		ROLLBACK;
        
        IF 101 = v_result THEN
			-- 실패 횟수 늘림(일단 잘못된 쿠폰만 체크)
			CALL tsp_mmo_usercoupon_fail_inc(p_UserID, v_fail_count);
        END IF;
	END IF;

	
	SELECT v_result, v_fail_count, v_use_type as use_type, v_post_sender_name as post_sender_name, v_post_content as post_content, v_post_text_id as post_text_id, 
			v_post_keep_day as post_keep_day, v_reward_gold as reward_gold, v_reward_greenruby as reward_greenruby, v_reward_redruby as reward_redruby, 
			v_reward_item_1_type as reward_item_1_type, v_reward_item_1_id as reward_item_1_id, v_reward_item_1_qty as reward_item_1_qty, 
			v_reward_item_2_type as reward_item_2_type, v_reward_item_2_id as  reward_item_2_id, v_reward_item_2_qty as reward_item_2_qty, 
			v_reward_item_3_type as reward_item_3_type, v_reward_item_3_id as reward_item_3_id, v_reward_item_3_qty as reward_item_3_qty,
			v_reward_item_4_type as reward_item_4_type, v_reward_item_4_id as reward_item_4_id, v_reward_item_4_qty as reward_item_4_qty,
			v_reward_item_5_type as reward_item_5_type, v_reward_item_5_id as reward_item_5_id, v_reward_item_5_qty	as reward_item_5_qty;
    
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-31 17:39:32
