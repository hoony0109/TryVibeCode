-- MySQL dump 10.13  Distrib 5.7.40, for Win64 (x86_64)
--
-- Host: localhost    Database: w_globaldb
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
-- Table structure for table `_analysis_ccu_utc`
--

DROP TABLE IF EXISTS `_analysis_ccu_utc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `_analysis_ccu_utc` (
  `fld_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '날짜',
  `fld_world_idx` int(11) NOT NULL COMMENT '월드 번호',
  `fld_ccu` int(11) NOT NULL COMMENT 'DAU',
  PRIMARY KEY (`fld_date`,`fld_world_idx`),
  KEY `IX_worldid` (`fld_world_idx`,`fld_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `_analysis_login`
--

DROP TABLE IF EXISTS `_analysis_login`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `_analysis_login` (
  `fld_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_id` bigint(20) NOT NULL,
  PRIMARY KEY (`fld_date`,`user_id`),
  KEY `ix_analysis_1` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `gamedb_shard_info`
--

DROP TABLE IF EXISTS `gamedb_shard_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `gamedb_shard_info` (
  `world_idx` smallint(11) NOT NULL DEFAULT '0' COMMENT '월드 고유번호',
  `shard_id` smallint(6) NOT NULL DEFAULT '0' COMMENT 'DB 번호',
  `db_account_qty` bigint(20) NOT NULL DEFAULT '0' COMMENT '사용자 수',
  `reg_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '등록일시',
  PRIMARY KEY (`world_idx`,`shard_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='샤딩 DB정보';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `line_account`
--

DROP TABLE IF EXISTS `line_account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `line_account` (
  `user_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '계정고유번호(게임에서 발급)',
  `account_type` int(11) NOT NULL COMMENT '인증 종류(google, facebook, ..등등)',
  `account_subtype` int(11) NOT NULL DEFAULT '0',
  `account_status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '계정 상태(0: 정상, 10:제재1, 11:제재2, 13:제재3.....)',
  `account_id` varchar(128) NOT NULL COMMENT '인증 받은 곳(google, facebook 등등)의 계정 고유 번호',
  `last_worldid` int(11) NOT NULL DEFAULT '0' COMMENT '마지막 접속 월드 번호',
  `push_device_token` varchar(256) NOT NULL DEFAULT '' COMMENT 'Push 용  Device Token(Google 과 Apple)',
  `push_enable` tinyint(4) NOT NULL DEFAULT '0' COMMENT '푸쉬 메시지 수락 여부',
  `user_email` varchar(128) NOT NULL DEFAULT '' COMMENT '이메일',
  `reg_ip_addr` varchar(128) NOT NULL DEFAULT '' COMMENT '등록시 접속 주소',
  `combine_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '게스트계정을 실제 계정과 결합한 날짜\n',
  `reg_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '등록날짜',
  `last_login_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '마지막 로그인 날짜(로그인 기준)\n',
  `withdrawal_enable` tinyint(4) NOT NULL DEFAULT '0' COMMENT '탈퇴 처리중인지\n0: 아님, 1: 처리중',
  `withdrawal_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'withdrawal_enable 가 1일 경우\n탈퇴 처리 날짜',
  `block_finish_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '0 < account_status 일 경우 블럭 종료 시간',
  `wemix_user_address` varchar(64) NOT NULL DEFAULT '' COMMENT '위믹스 지갑 주소',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `UNIQUE_TYPE_ID` (`account_type`,`account_subtype`,`account_id`),
  KEY `IX_push_device_token` (`push_enable`,`push_device_token`),
  KEY `IX_withdrawal` (`withdrawal_enable`,`withdrawal_date`),
  KEY `IX_accountid` (`account_id`),
  KEY `IX_wemix_user_address` (`wemix_user_address`)
) ENGINE=InnoDB AUTO_INCREMENT=2402 DEFAULT CHARSET=utf8mb4 COMMENT='월드 별 계정';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `line_account_world`
--

DROP TABLE IF EXISTS `line_account_world`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `line_account_world` (
  `world_idx` int(11) NOT NULL DEFAULT '0' COMMENT '월드 고유번호',
  `account_idx` bigint(20) NOT NULL DEFAULT '0' COMMENT '계정고유번호',
  `game_user_idx` bigint(20) NOT NULL DEFAULT '0',
  `character_exist` tinyint(4) NOT NULL DEFAULT '0' COMMENT '월드에 캐릭터를 생성 했는지 여부',
  `gamedb_idx` smallint(6) NOT NULL DEFAULT '1' COMMENT '(디폴트로 선택된) 유저별 게임DB정보를 위한 참조 키',
  `reg_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '등록일시',
  `last_login_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '월드 접속일시 [월드 접속 시 최신정보로 업데이트]',
  PRIMARY KEY (`world_idx`,`account_idx`),
  KEY `IX_nickname` (`world_idx`),
  KEY `IX_nickname2` (`world_idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='월드 별 계정';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'w_globaldb'
--
/*!50003 DROP FUNCTION IF EXISTS `fn_Get_ExpiryDateTime` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` FUNCTION `fn_Get_ExpiryDateTime`(
	p_day		INT	
) RETURNS datetime
    DETERMINISTIC
BEGIN

	DECLARE v_DateTime	DATETIME;

	SET v_DateTime := DATE_FORMAT( DATE_ADD( CURRENT_TIMESTAMP(), INTERVAL p_day DAY), '%Y-%m-%d %H:%i:%s' );

	RETURN v_DateTime;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `udf_db_Amount_Upd` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` FUNCTION `udf_db_Amount_Upd`(
	p_worldIdx	INT		
,	p_dbIdx		SMALLINT	
,	p_dbType	CHAR(1)		
) RETURNS int(11)
    DETERMINISTIC
BEGIN



	DECLARE p_Result	INT;
	SET p_Result := 1;	

	
	UPDATE `db` SET db_amount = db_amount + 1
		WHERE world_idx = p_worldIdx
		AND db_idx = p_dbIdx
		AND db_type = p_dbType;

	
	IF ROW_COUNT() <> 1 THEN
		SET p_Result := -7;	
	END IF;

	RETURN p_Result;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `udf_db_Ins` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` FUNCTION `udf_db_Ins`(
	p_worldIdx	SMALLINT	
,	p_dbIdx		SMALLINT	
,	p_dbType	CHAR(1)		
,	p_host		VARCHAR(128)	
,	p_dbName	VARCHAR(30)	
,	p_dbPort	INT		
,	p_useYn		CHAR(1)		
) RETURNS int(11)
    DETERMINISTIC
BEGIN



	DECLARE p_Result	INT;
	SET p_Result := 1;	

	
	INSERT INTO `db` (world_idx, db_idx, db_type, `host`, db_name, db_port, use_yn)
	VALUES (p_worldIdx, p_dbIdx, p_dbType, p_host, p_dbName, p_dbPort, p_useYn);

	
	IF ROW_COUNT() <> 1 THEN
		SET p_Result := -7;	
	END IF;

	RETURN p_Result;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `udf_db_Upd` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` FUNCTION `udf_db_Upd`(
	p_worldIdx	INT		
,	p_dbIdx		SMALLINT	
,	p_dbType	CHAR(1)		
,	p_host		VARCHAR(128)	
,	p_dbName	VARCHAR(30)	
,	p_dbPort	INT		
,	p_useYn		CHAR(1)		
) RETURNS int(11)
    DETERMINISTIC
BEGIN



	DECLARE p_Result	INT;
	SET p_Result := 1;	

	
	UPDATE `db` SET `host` = p_host,
			db_name = p_dbName,
			db_port = p_dbPort,
			use_yn = p_useYn
		WHERE db_idx = p_dbIdx
		AND world_idx = p_worldIdx
		AND db_type = p_dbType;

	
	IF ROW_COUNT() <> 1 THEN
		SET p_Result := -7;	
	END IF;

	RETURN p_Result;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `udf_line_account_Ins` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` FUNCTION `udf_line_account_Ins`(
	p_gameCd		VARCHAR(50)		
,	p_gnid			BIGINT	UNSIGNED	
,	p_newGnidYn		VARCHAR(2)		
,	p_nid			BIGINT	UNSIGNED	
,	p_newNidYn		VARCHAR(2)		
,	p_gameServerId		VARCHAR(50)		
,	p_shortNid		TEXT			
,	p_timeZoneId		VARCHAR(100)		
,	p_timeZoneOffsetSec	INT			
,	p_termsAgreeUnixTS	BIGINT			
,	p_privacyAgreeUnixTS	BIGINT			
,	p_pushAgreeUnixTS	BIGINT			
,	p_nightPushAgreeUnixTS	BIGINT			
) RETURNS int(11)
    DETERMINISTIC
BEGIN



	DECLARE p_Result	BIGINT;

	INSERT INTO line_account (account_idx, gameCd, gnid, newGnidYn, nid, newNidYn, gameServerId, shortNid, timeZoneId, timeZoneOffsetSec, termsAgreeUnixTS, privacyAgreeUnixTS, pushAgreeUnixTS, nightPushAgreeUnixTS)
	VALUES (p_nid, p_gameCd, p_gnid, p_newGnidYn, p_nid, p_newNidYn, p_gameServerId, p_shortNid, p_timeZoneId, p_timeZoneOffsetSec, p_termsAgreeUnixTS, p_privacyAgreeUnixTS, p_pushAgreeUnixTS, p_nightPushAgreeUnixTS);

	
	IF ROW_COUNT() <> 1 THEN
		SET p_Result := -7;	
	END IF;

	RETURN p_Result;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `udf_line_account_world_Ins` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` FUNCTION `udf_line_account_world_Ins`(
	p_accountIdx	BIGINT		
,	p_worldIdx	INT		
,	p_gamedbIdx	SMALLINT	
) RETURNS int(11)
    DETERMINISTIC
BEGIN



	DECLARE p_Result	INT;
	SET p_Result := 1;	

	
	INSERT INTO line_account_world (account_idx, world_idx, gamedb_idx, last_login_date)
	VALUES (p_accountIdx, p_worldIdx, p_gamedbIdx, NOW());

	
	IF ROW_COUNT() <> 1 THEN
		SET p_Result := -7;	
	END IF;

	RETURN p_Result;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `udf_line_account_world_Nickname_Upd` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` FUNCTION `udf_line_account_world_Nickname_Upd`(
	p_worldIdx	INT		
,	p_accountIdx	BIGINT		
,	p_nickname	VARCHAR(30)	
) RETURNS int(11)
    DETERMINISTIC
BEGIN



	DECLARE p_Result	INT;
	SET p_Result := 1;	

	UPDATE line_account_world SET nickname = p_nickname
			WHERE world_idx = p_worldIdx
			AND account_idx = p_accountIdx;
	
	
	IF ROW_COUNT() <> 1 THEN
		SET p_Result := -7;	
	END IF;

	RETURN p_Result;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `udf_line_account_world_TutorialPlay_Upd` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` FUNCTION `udf_line_account_world_TutorialPlay_Upd`(
	p_worldIdx	INT		
,	p_accountIdx	BIGINT		
,	p_tutorialPlay	SMALLINT	
) RETURNS int(11)
    DETERMINISTIC
BEGIN



	DECLARE p_Result	INT;
	SET p_Result := 1;	

	UPDATE line_account_world SET tutorial_play = p_tutorialPlay
			WHERE world_idx = p_worldIdx
			AND account_idx = p_accountIdx;
	
	
	IF ROW_COUNT() <> 1 THEN
		SET p_Result := -7;	
	END IF;

	RETURN p_Result;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `udf_line_account_world_Upd` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` FUNCTION `udf_line_account_world_Upd`(
	p_worldIdx		INT		
,	p_accountIdx		BIGINT		
) RETURNS int(11)
    DETERMINISTIC
BEGIN



	DECLARE p_Result	INT;
	SET p_Result := 1;	

	
	UPDATE line_account_world SET last_login_date = NOW()
		WHERE world_idx = p_worldIdx
		AND account_idx = p_accountIdx;

	
	IF ROW_COUNT() <> 1 THEN
		SET p_Result := -7;	
	END IF;

	RETURN p_Result;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `udf_mmoServer_Ins` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` FUNCTION `udf_mmoServer_Ins`(
	p_worldIdx	INT		
,	p_host		VARCHAR(128)	
,	p_serverName	VARCHAR(30)	
,	p_serverType	CHAR(2)		
,	p_serverPort	INT		
,	p_serverRegion	INT		
,	p_useYn		CHAR(1)		
) RETURNS int(11)
    DETERMINISTIC
BEGIN



	DECLARE p_Result	INT;
	SET p_Result := 1;	

	
	INSERT INTO mmoServer (world_idx, `host`, server_name, server_type, server_port, server_region, use_yn)
	VALUES (p_worldIdx, p_host, p_serverName, p_serverType, p_serverPort, p_serverRegion, p_useYn);

	
	IF ROW_COUNT() <> 1 THEN
		SET p_Result := -7;	
	END IF;

	RETURN p_Result;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `udf_mmoServer_Upd` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` FUNCTION `udf_mmoServer_Upd`(
	p_serverIdx	SMALLINT	
,	p_worldIdx	INT		
,	p_host		VARCHAR(128)	
,	p_serverName	VARCHAR(30)	
,	p_serverType	CHAR(2)		
,	p_serverPort	INT		
,	p_serverRegion	INT		
,	p_useYn		CHAR(1)		
) RETURNS int(11)
    DETERMINISTIC
BEGIN



	DECLARE p_Result	INT;
	SET p_Result := 1;	

	
	UPDATE mmoServer SET world_idx = p_worldIdx,
			`host` = p_host,
			server_name = p_serverName,
			server_type = p_serverType,
			server_port = p_serverPort,
			server_region = p_serverRegion,
			use_yn = p_useYn
		WHERE server_idx = p_serverIdx;

	
	IF ROW_COUNT() <> 1 THEN
		SET p_Result := -7;	
	END IF;

	RETURN p_Result;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `udf_world_Ins` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` FUNCTION `udf_world_Ins`(
	p_worldIdx	SMALLINT	
,	p_worldname	VARCHAR(30)	
,	p_eventTab	INT		
,	p_connectMax	INT		
,	p_intervalTime	INT		
,	p_useYn		CHAR(1)		
) RETURNS int(11)
    DETERMINISTIC
BEGIN



	DECLARE p_Result	INT;
	SET p_Result := 1;	

	
	INSERT INTO world (world_idx, worldname, event_tab, connect_max, interval_time, world_yn)
	VALUES (p_worldIdx, p_worldname, p_eventTab, p_connectMax, p_intervalTime, p_useYn);

	
	IF ROW_COUNT() <> 1 THEN
		SET p_Result := -7;	
	END IF;

	RETURN p_Result;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `udf_world_Upd` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` FUNCTION `udf_world_Upd`(
	p_worldIdx	INT		
,	p_worldname	VARCHAR(30)	
,	p_eventTab	INT		
,	p_connectMax	INT		
,	p_intervalTime	INT		
,	p_useYn		CHAR(1)		
) RETURNS int(11)
    DETERMINISTIC
BEGIN



	DECLARE p_Result	INT;
	SET p_Result := 1;	

	
	UPDATE world SET worldname = p_worldname,
			event_tab = p_eventTab,
			connect_max = p_connectMax,
			interval_time = p_intervalTime,
			world_yn = p_useYn
		WHERE world_idx = p_worldIdx;

	
	IF ROW_COUNT() <> 1 THEN
		SET p_Result := -7;	
	END IF;

	RETURN p_Result;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `msp_admin_account_update` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `msp_admin_account_update`(
	IN p_AccountID		BIGINT		-- 계정 고유 번호(게임측)
,	IN p_Status			INT			-- 계정 제재 번호
,	IN p_BlockTimeHour	INT 		-- 제재 시간
)
    COMMENT '제재하기'
BEGIN
	DECLARE v_result 		INT DEFAULT 101;	-- 실패

	-- account_world update
	UPDATE line_account
	SET account_status = p_Status, block_finish_date = DATE_ADD(NOW(), INTERVAL p_BlockTimeHour HOUR)
	WHERE user_id = p_AccountID;

	-- Error Check
	IF ROW_COUNT() > 0 THEN
		SET v_result = 0;	-- 성공
	END IF;
	
	SELECT v_result;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `msp_insert_show_ccu_utc` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `msp_insert_show_ccu_utc`( 
)
BEGIN
	declare v_1 INT DEFAULT 0;
    declare v_2 INT DEFAULT 0;
    declare v_3 INT DEFAULT 0;
    declare v_4 INT DEFAULT 0;
    declare v_5 INT DEFAULT 0;
    declare v_6 INT DEFAULT 0;
    declare v_7 INT DEFAULT 0;
    declare v_8 INT DEFAULT 0;
    declare v_9 INT DEFAULT 0;
    declare v_10 INT DEFAULT 0;
    declare v_11 INT DEFAULT 0;
    declare v_12 INT DEFAULT 0;
    declare v_13 INT DEFAULT 0;
    declare v_14 INT DEFAULT 0;
    
    
    declare v_total INT DEFAULT 0;
    
    declare v_date_now DATETIME DEFAULT utc_timestamp();
    declare v_date_before_1min DATETIME DEFAULT utc_timestamp();
    declare v_date_before_2min DATETIME DEFAULT utc_timestamp();
    declare v_date_before_3min DATETIME DEFAULT utc_timestamp();
    declare v_date_before_4min DATETIME DEFAULT utc_timestamp();
    declare v_date_before_5min DATETIME DEFAULT utc_timestamp();
    declare v_date_before_6min DATETIME DEFAULT utc_timestamp();
    
    set v_date_before_1min = DATE_SUB(utc_timestamp(), INTERVAL 1 MINUTE);
    set v_date_before_2min = DATE_SUB(utc_timestamp(), INTERVAL 2 MINUTE);
    set v_date_before_3min = DATE_SUB(utc_timestamp(), INTERVAL 3 MINUTE);
    set v_date_before_4min = DATE_SUB(utc_timestamp(), INTERVAL 4 MINUTE);
    set v_date_before_5min = DATE_SUB(utc_timestamp(), INTERVAL 5 MINUTE);
    set v_date_before_6min = DATE_SUB(utc_timestamp(), INTERVAL 6 MINUTE);
   
	select fld_ccu INTO v_1 from w_globaldb._analysis_ccu_utc where fld_world_idx = 1 and fld_date = DATE_FORMAT(v_date_before_1min, "%Y-%c-%e %H:%i:00");
	select fld_ccu INTO v_2 from w_globaldb._analysis_ccu_utc where fld_world_idx = 2 and fld_date = DATE_FORMAT(v_date_before_1min, "%Y-%c-%e %H:%i:00");
	select fld_ccu INTO v_3 from w_globaldb._analysis_ccu_utc where fld_world_idx = 3 and fld_date = DATE_FORMAT(v_date_before_1min, "%Y-%c-%e %H:%i:00");
    select fld_ccu INTO v_10 from w_globaldb._analysis_ccu_utc where fld_world_idx = 10 and fld_date = DATE_FORMAT(v_date_before_1min, "%Y-%c-%e %H:%i:00");
    select fld_ccu INTO v_11 from w_globaldb._analysis_ccu_utc where fld_world_idx = 11 and fld_date = DATE_FORMAT(v_date_before_1min, "%Y-%c-%e %H:%i:00");
    select fld_ccu INTO v_14 from w_globaldb._analysis_ccu_utc where fld_world_idx = 14 and fld_date = DATE_FORMAT(v_date_before_1min, "%Y-%c-%e %H:%i:00");
	
    select fld_ccu INTO v_4 from w_globaldb._analysis_ccu_utc where fld_world_idx = 4 and fld_date = DATE_FORMAT(v_date_before_1min, "%Y-%c-%e %H:%i:00");    
	
    select fld_ccu INTO v_5 from w_globaldb._analysis_ccu_utc where fld_world_idx = 5 and fld_date = DATE_FORMAT(v_date_before_1min, "%Y-%c-%e %H:%i:00");
    select fld_ccu INTO v_12 from w_globaldb._analysis_ccu_utc where fld_world_idx = 12 and fld_date = DATE_FORMAT(v_date_before_1min, "%Y-%c-%e %H:%i:00");
	
    select fld_ccu INTO v_6 from w_globaldb._analysis_ccu_utc where fld_world_idx = 6 and fld_date = DATE_FORMAT(v_date_before_1min, "%Y-%c-%e %H:%i:00");
    select fld_ccu INTO v_13 from w_globaldb._analysis_ccu_utc where fld_world_idx = 13 and fld_date = DATE_FORMAT(v_date_before_1min, "%Y-%c-%e %H:%i:00");
	
    select fld_ccu INTO v_7 from w_globaldb._analysis_ccu_utc where fld_world_idx = 7 and fld_date = DATE_FORMAT(v_date_before_1min, "%Y-%c-%e %H:%i:00");
	select fld_ccu INTO v_8 from w_globaldb._analysis_ccu_utc where fld_world_idx = 8 and fld_date = DATE_FORMAT(v_date_before_1min, "%Y-%c-%e %H:%i:00");
	select fld_ccu INTO v_9 from w_globaldb._analysis_ccu_utc where fld_world_idx = 9 and fld_date = DATE_FORMAT(v_date_before_1min, "%Y-%c-%e %H:%i:00");

    
	set v_total = v_1 + v_2 + v_3 + v_4 + v_5 + v_6 + v_7 + v_8 + v_9 + v_10 + v_11 + v_12 + v_13 + v_14;

	INSERT INTO _show_ccu_utc values (DATE_FORMAT(v_date_before_1min, "%Y-%c-%e %H:%i:00") , v_total, v_1, v_2, v_3, v_10, v_11, v_14, v_4, v_5, v_12, v_6, v_13, v_7, v_8, v_9);

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `msp_lineaccount_select_wemixuseraddress` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `msp_lineaccount_select_wemixuseraddress`(
	IN p_WemixUserAddress	VARCHAR(128)	-- 위믹스 지갑 주소
)
    COMMENT '위믹스 지갑 주소 체크'
BEGIN
	DECLARE v_account_type INT DEFAULT 0;	-- 0:회원아님, 1:회원, 8:회원(올드 유저임, 등록날짜가 일주일 이상 지남)
	DECLARE v_reg_date DATETIME DEFAULT NOW();	-- 등록 날자
	DECLARE v_account_id BIGINT DEFAULT 0;


	root:
	BEGIN
		SELECT user_id, reg_date INTO v_account_id, v_reg_date
		FROM line_account
		WHERE wemix_user_address = p_WemixUserAddress LIMIT 1;
				
		-- 회원일 경우 저장하자
		IF 0 < FOUND_ROWS() THEN
			-- 이미 JCG에 등록해 있을 경우 
			IF EXISTS(SELECT * FROM w_iapdb.tbl_jcg_account WHERE wemix_user_address = p_WemixUserAddress LIMIT 1) THEN
				SET v_account_type = 1;	-- JCG 등록 회원
				LEAVE root;
			END IF;		
		
			-- 저장해 놓는다 IAP DB에
			IF 7 <= DATEDIFF(now(), v_reg_date) THEN
				SET v_account_type = 7;	-- 기존 올드 회원임(스톰게임즈)
			ELSE
				SET v_account_type = 1;	-- JCG 등록 회원
				INSERT IGNORE INTO w_iapdb.tbl_jcg_account (wemix_user_address, account_id) VALUES(p_WemixUserAddress, v_account_id);
			END IF;
		END IF;
	END;
	
	SELECT v_account_type, UNIX_TIMESTAMP(v_reg_date) as reg_date;
	
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
    CALL w_iapdb.msp_mmo_event_bitcoin_datas_select(p_AccountID, p_StartTime, p_EndTime, p_IAPEventType);	
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
	CALL w_iapdb.msp_mmo_event_bitcoin_datas_update(p_AccountID, p_EventType, p_Condition1, p_Condition2, p_Value);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_mmo_accountworld_select` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `sp_mmo_accountworld_select`(
	IN p_WorldID		INT			
,	IN p_UserID			BIGINT	-- 게임 계정 고유 번호	
)
    COMMENT '월드 선택'
BEGIN
    
    -- 선택한 월드의 계정 정보
    /*
	SELECT gamedb_idx, IF(character_exist = 0, false, true) AS character_exist, game_user_idx
    FROM line_account_world
    WHERE world_idx = p_WorldID AND account_idx = p_UserID;
    */
    
	SELECT gamedb_idx, IF(character_exist = 0, false, true) AS character_exist, game_user_idx, la.wemix_user_address
    FROM line_account_world law
    INNER JOIN line_account la ON la.user_id = p_UserID
    WHERE world_idx = p_WorldID AND account_idx = p_UserID;
	
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_mmo_accountworld_select2` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `sp_mmo_accountworld_select2`(
	IN p_WorldID		INT			
,	IN p_UserID			BIGINT	-- 게임 계정 고유 번호	
)
    COMMENT '월드 선택'
BEGIN
    DECLARE v_firstmake_world_id 	INT DEFAULT 0;	-- 제일처음 유저가 접속한 월드 번호(캐릭터를 만들지 않아도 서버 선택을 할 경우 생성됨)
	
	-- 최초 접속 월드 번호 셋팅
	SELECT world_idx INTO v_firstmake_world_id FROM line_account_world
	WHERE account_idx = p_UserID
	ORDER BY reg_date limit 1;
	
    -- 선택한 월드의 계정 정보
    /*
	SELECT gamedb_idx, IF(character_exist = 0, false, true) AS character_exist, game_user_idx
    FROM line_account_world
    WHERE world_idx = p_WorldID AND account_idx = p_UserID;
    */
    
	SELECT gamedb_idx, IF(character_exist = 0, false, true) AS character_exist, game_user_idx, la.wemix_user_address, v_firstmake_world_id
    FROM line_account_world law
    INNER JOIN line_account la ON la.user_id = p_UserID
    WHERE world_idx = p_WorldID AND account_idx = p_UserID;
	
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_mmo_accountworld_select_gamedbidx` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `sp_mmo_accountworld_select_gamedbidx`(
	IN p_WorldID		INT 	-- 월드 고유 번호
,	IN p_GameUserID		BIGINT	-- 게임 디비 상의 유저 고유 번호
)
    COMMENT '게임 db index얻기'
BEGIN
    		
	SELECT gamedb_idx
	FROM line_account_world 
	WHERE game_user_idx = p_GameUserID AND world_idx = p_WorldID;
    
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_mmo_account_delete_withdrawal` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `sp_mmo_account_delete_withdrawal`(
	IN p_UserID		BIGINT 	
)
    COMMENT '계정 매핑을 삭제한다.'
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
    

	
    
    DELETE FROM line_account
    WHERE user_id = p_UserID;
    
    IF ROW_COUNT() = 0 THEN 
		SET v_result = 101;		
    END IF;
    
    SELECT v_result;
    
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_mmo_account_insert_google` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `sp_mmo_account_insert_google`(
	IN p_Type				int				-- 계정 타입(1:GUEST, 2:Google, 3:facebook, 4:)
,	IN p_AccountID			VARCHAR(128)	-- 인증 서버(google) 계정 고유 번호(64bit를 넘어가서 문자열로 지정)
,	IN p_PushDeviceToken	VARCHAR(128)	-- DEVICE Token(Push를 위한 goole or apple에서 발급받음 device token)
,	IN p_PushEnable			TINYINT(1)		-- 푸쉬 동의 여부
,	IN p_EMail				VARCHAR(128)	-- 이메일
,	IN p_Address			VARCHAR(30)		-- 접속 IP
)
    COMMENT 'Guest 및 외부 계정 등록하기(처음 등록)'
BEGIN
	DECLARE	v_errno			INT DEFAULT 0;
	DECLARE v_result 		INT DEFAULT 0;
    
    DECLARE v_userID		BIGINT DEFAULT 0;	-- LS 게임에서 발급하는 유저 고유 번호
    
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		GET CURRENT DIAGNOSTICS CONDITION 1
			v_errno = MYSQL_ERRNO;
			SET v_result := (v_errno * -1);
		ROLLBACK;

		SELECT v_result, v_userID;
	END;
    
    root:
    BEGIN    

    	-- (1) 월드 별 계정 유무 확인
        SELECT user_id INTO v_userID 
        FROM line_account 
        -- WHERE account_type = p_Type AND account_id collate utf8mb4_unicode_ci = p_AccountID collate utf8mb4_unicode_ci;
        WHERE account_type = p_Type AND account_id = p_AccountID;
		IF 0 < v_userID THEN
		BEGIN
			SET v_result = 101;	-- 정보있음
           
            LEAVE root;
		END;
        END IF;
        
		IF v_result = 0 THEN
        subroot:
		BEGIN
			START TRANSACTION;
            /*
            INSERT INTO factory_account VALUES();
    
			IF ROW_COUNT() <= 0 THEN
				SET v_result = 102;	-- 등록 실패1
                LEAVE subroot;
            END IF;
            
            SET v_userID = LAST_INSERT_ID();
			
			-- 전체 계정 등록(생성)
			INSERT INTO line_account (user_id, account_type, account_id, push_device_token, push_enable, user_email, reg_ip_addr, combine_date, reg_date)
			VALUES (v_userID, p_Type, p_AccountID, p_PushDeviceToken, p_PushEnable, p_EMail, p_Address, NOW(), NOW());
			
			IF ROW_COUNT() <= 0 THEN 
				SET v_result = 103;	-- 등록 실패
				ROLLBACK;
				LEAVE subroot;
			END IF;
            */
			-- 전체 계정 등록(생성)
			INSERT INTO line_account (account_type, account_id, push_device_token, push_enable, user_email, reg_ip_addr, combine_date, reg_date)
			VALUES (p_Type, p_AccountID, p_PushDeviceToken, p_PushEnable, p_EMail, p_Address, NOW(), NOW());
			
			IF ROW_COUNT() <= 0 THEN 
				SET v_result = 103;	-- 등록 실패
				ROLLBACK;
				LEAVE subroot;
			END IF;
            
            SET v_userID = LAST_INSERT_ID();
			
			COMMIT;
		END;
        END IF;

    END;
	
	SELECT v_result, v_userID;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_mmo_account_insert_new` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `sp_mmo_account_insert_new`(
	IN _worldidx	INT
,	IN _accountID	BIGINT
)
    COMMENT '월드별 최초 계정 추가하기'
BEGIN
	DECLARE	v_errno			INT DEFAULT 0;
	DECLARE v_result 		INT DEFAULT 0;
    
    DECLARE v_gamedb_index	SMALLINT DEFAULT 0;		-- 샤딩DB ID
    DECLARE v_game_user_idx	BIGINT DEFAULT 0;		-- 월드별 UserID
    
    DECLARE v_dbType		CHAR(1) DEFAULT 'U';	-- DB 타입(U:게임)
		

	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		GET CURRENT DIAGNOSTICS CONDITION 1
			v_errno = MYSQL_ERRNO;
			SET v_result := (v_errno * -1);
		ROLLBACK;

		SELECT v_result, v_game_user_idx, v_gamedb_index;
	END;
    
        
    root:
    BEGIN
    
    	-- (1) 월드 별 계정 유무 확인
		IF EXISTS( SELECT * FROM line_account_world WHERE world_idx = _worldidx AND account_idx = _accountID ) THEN
		BEGIN
			SET v_result = 101;	-- 정보있음
            
			SELECT gamedb_idx INTO v_gamedb_index
			FROM line_account_world WHERE world_idx = _worldidx AND account_idx = _accountID;
            
            IF 0 = FOUND_ROWS() THEN
				SET v_result = 102;	-- 정보 찾지 못함
            END IF;
            
            LEAVE root;
		END;
        END IF;
		
		-- (2) 샤딩DB 정보세팅
		-- 카운트가 낮은 샤딩DB에서 가져온다!(동일할때는 순번이 빠른 DB[고유번호] 선택) 
        /*
		SELECT db_idx INTO v_gamedb_index
		FROM `db` WHERE world_idx = _worldidx AND db_type = v_dbType
		ORDER BY db_amount ASC LIMIT 1;
        */        
        SELECT shard_id INTO v_gamedb_index
        FROM gamedb_shard_info WHERE world_idx = _worldidx
        ORDER BY db_account_qty ASC LIMIT 1;
        

		IF 0 = FOUND_ROWS() THEN
			SET v_result = 103;	-- 샤딩DB 정보 얻지 못함
            LEAVE root;
		END IF;
   
		IF v_result = 0 THEN
        subroot:
		BEGIN
			START TRANSACTION;
        
			-- (3) 샤딩DB 카운트 올려주기!
            /*
			UPDATE `db` SET db_amount = db_amount + 1
			WHERE world_idx = _worldidx	AND db_idx = v_gamedb_index	AND db_type = v_dbType;
			*/
            UPDATE gamedb_shard_info 
            SET db_account_qty = db_account_qty + 1
            WHERE world_idx = _worldidx	AND shard_id = v_gamedb_index;
            
			IF ROW_COUNT() <= 0 THEN 
				SET v_result = 104;	-- 샤딩DB 카운트 UPDATE 실패
				ROLLBACK;
				LEAVE subroot;
			END IF;
            
            
            SET v_game_user_idx = CAST(CONCAT(_worldidx, _accountID) AS SIGNED);
			
            -- (4) 월드 별 계정 등록(생성)
			INSERT INTO line_account_world (account_idx, world_idx, game_user_idx, gamedb_idx, last_login_date)
			VALUES (_accountID, _worldidx, v_game_user_idx, v_gamedb_index, NOW());
			            
			IF ROW_COUNT() <= 0 THEN 
				SET v_result = 105;	-- 월드별 계정 등록 실패
				ROLLBACK;
				LEAVE subroot;
			END IF;
			
			COMMIT;
		END;
        END IF;

    END;
	
	SELECT v_result, v_game_user_idx, v_gamedb_index;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_mmo_account_insert_new2` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `sp_mmo_account_insert_new2`(
	IN _worldidx	INT
,	IN _accountID	BIGINT
)
    COMMENT '월드별 최초 계정 추가하기'
BEGIN
	DECLARE	v_errno			INT DEFAULT 0;
	DECLARE v_result 		INT DEFAULT 0;
    
    DECLARE v_gamedb_index	SMALLINT DEFAULT 0;		-- 샤딩DB ID
    DECLARE v_game_user_idx	BIGINT DEFAULT 0;		-- 월드별 UserID
    
    DECLARE v_dbType		CHAR(1) DEFAULT 'U';	-- DB 타입(U:게임)
	
	DECLARE v_firstmake_world_id 	INT DEFAULT 0;	-- 제일처음 유저가 접속한 월드 번호(캐릭터를 만들지 않아도 서버 선택을 할 경우 생성됨)

	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		GET CURRENT DIAGNOSTICS CONDITION 1
			v_errno = MYSQL_ERRNO;
			SET v_result := (v_errno * -1);
		ROLLBACK;

		SELECT v_result, v_game_user_idx, v_gamedb_index, v_firstmake_world_id;
	END;
    
        
    root:
    BEGIN
    
    	-- (1) 월드 별 계정 유무 확인
		IF EXISTS( SELECT * FROM line_account_world WHERE world_idx = _worldidx AND account_idx = _accountID ) THEN
		BEGIN
			SET v_result = 101;	-- 정보있음
            
			SELECT gamedb_idx INTO v_gamedb_index
			FROM line_account_world WHERE world_idx = _worldidx AND account_idx = _accountID;
            
            IF 0 = FOUND_ROWS() THEN
				SET v_result = 102;	-- 정보 찾지 못함
            END IF;
            
            LEAVE root;
		END;
        END IF;
		
		-- (2) 샤딩DB 정보세팅
		-- 카운트가 낮은 샤딩DB에서 가져온다!(동일할때는 순번이 빠른 DB[고유번호] 선택) 
        /*
		SELECT db_idx INTO v_gamedb_index
		FROM `db` WHERE world_idx = _worldidx AND db_type = v_dbType
		ORDER BY db_amount ASC LIMIT 1;
        */        
        SELECT shard_id INTO v_gamedb_index
        FROM gamedb_shard_info WHERE world_idx = _worldidx
        ORDER BY db_account_qty ASC LIMIT 1;
        

		IF 0 = FOUND_ROWS() THEN
			SET v_result = 103;	-- 샤딩DB 정보 얻지 못함
            LEAVE root;
		END IF;
   
		IF v_result = 0 THEN
        subroot:
		BEGIN
			START TRANSACTION;
        
			-- (3) 샤딩DB 카운트 올려주기!
            /*
			UPDATE `db` SET db_amount = db_amount + 1
			WHERE world_idx = _worldidx	AND db_idx = v_gamedb_index	AND db_type = v_dbType;
			*/
            UPDATE gamedb_shard_info 
            SET db_account_qty = db_account_qty + 1
            WHERE world_idx = _worldidx	AND shard_id = v_gamedb_index;
            
			IF ROW_COUNT() <= 0 THEN 
				SET v_result = 104;	-- 샤딩DB 카운트 UPDATE 실패
				ROLLBACK;
				LEAVE subroot;
			END IF;
            
            
            SET v_game_user_idx = CAST(CONCAT(_worldidx, _accountID) AS SIGNED);
			
            -- (4) 월드 별 계정 등록(생성)
			INSERT INTO line_account_world (account_idx, world_idx, game_user_idx, gamedb_idx, last_login_date)
			VALUES (_accountID, _worldidx, v_game_user_idx, v_gamedb_index, NOW());
			            
			IF ROW_COUNT() <= 0 THEN 
				SET v_result = 105;	-- 월드별 계정 등록 실패
				ROLLBACK;
				LEAVE subroot;
			END IF;
			
			COMMIT;
			
			-- 최초 접속 월드 번호 셋팅
			SELECT world_idx INTO v_firstmake_world_id FROM line_account_world
			WHERE account_idx = _accountID
			ORDER BY reg_date limit 1;			
						
		END;
        END IF;

    END;
	
	SELECT v_result, v_game_user_idx, v_gamedb_index, v_firstmake_world_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_mmo_account_insert_quicksdk` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `sp_mmo_account_insert_quicksdk`(
	IN p_Type				INT				-- 계정 타입(1:GUEST, 2:Google, 3:facebook, 99:quicksdk)
,	IN p_SubType			INT				-- 계정 SUB 타입()
,	IN p_AccountID			VARCHAR(128)	-- 인증 서버(google) 계정 고유 번호(64bit를 넘어가서 문자열로 지정)
,	IN p_PushDeviceToken	VARCHAR(128)	-- DEVICE Token(Push를 위한 goole or apple에서 발급받음 device token)
,	IN p_PushEnable			TINYINT(1)		-- 푸쉬 동의 여부
,	IN p_EMail				VARCHAR(128)	-- 이메일
,	IN p_Address			VARCHAR(128)		-- 접속 IP
)
    COMMENT 'Guest 및 외부 계정 등록하기(처음 등록)'
BEGIN
	DECLARE	v_errno			INT DEFAULT 0;
	DECLARE v_result 		INT DEFAULT 0;
    
    DECLARE v_userID		BIGINT DEFAULT 0;	-- LS 게임에서 발급하는 유저 고유 번호
    
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		GET CURRENT DIAGNOSTICS CONDITION 1
			v_errno = MYSQL_ERRNO;
			SET v_result := (v_errno * -1);
		ROLLBACK;

		SELECT v_result, v_userID;
	END;
    
    root:
    BEGIN    

    	-- (1) 월드 별 계정 유무 확인
        SELECT user_id INTO v_userID 
        FROM line_account 
        WHERE account_type = p_Type AND account_subtype = p_SubType AND account_id = p_AccountID;        
		IF 0 < v_userID THEN
		BEGIN
			SET v_result = 101;	-- 정보있음
           
            LEAVE root;
		END;
        END IF;
        
		IF v_result = 0 THEN
        subroot:
		BEGIN
			START TRANSACTION;
            
            /*
            메모리기반 스토리지 엔진인 InnoDB 의 경우
			재부팅을 할 때 SELECT MAX(num) 구문을 사용하여 auto_increment 값을 새로 저장하기 때문입니다.
			따라서 다음 값은 11이 아닌 6이 됩니다.
			( 중간 값이 삭제되는 경우에는 아무런 이슈가 없습니다. )
            
            INSERT INTO factory_account VALUES();
    
			IF ROW_COUNT() <= 0 THEN
				SET v_result = 102;	-- 등록 실패1
                LEAVE subroot;
            END IF;
            
            SET v_userID = LAST_INSERT_ID();
			
			-- 전체 계정 등록(생성)
			INSERT INTO line_account (user_id, account_type, account_subtype, account_id, push_device_token, push_enable, user_email, reg_ip_addr, combine_date, reg_date)
			VALUES (v_userID, p_Type, p_SubType, p_AccountID, p_PushDeviceToken, p_PushEnable, p_EMail, p_Address, NOW(), NOW());
			
			IF ROW_COUNT() <= 0 THEN 
				SET v_result = 103;	-- 등록 실패
				ROLLBACK;
				LEAVE subroot;
			END IF;
			*/
			-- 전체 계정 등록(생성)
			INSERT INTO line_account (account_type, account_subtype, account_id, push_device_token, push_enable, user_email, reg_ip_addr, combine_date, reg_date)
			VALUES (p_Type, p_SubType, p_AccountID, p_PushDeviceToken, p_PushEnable, p_EMail, p_Address, NOW(), NOW());
			
			IF ROW_COUNT() <= 0 THEN 
				SET v_result = 103;	-- 등록 실패
				ROLLBACK;
				LEAVE subroot;
			END IF;            
            
            SET v_userID = LAST_INSERT_ID();
            
			COMMIT;
		END;
        END IF;

    END;
	
	SELECT v_result, v_userID;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_mmo_account_select_check` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `sp_mmo_account_select_check`(
	IN  p_AccountType		INT					-- 계정 타입
,	IN 	p_AccountID			VARCHAR(128)		-- 계정 고유 값(구글/아이폰)
)
    COMMENT '계정 로그인'
BEGIN
		
	SELECT user_id, IF(now() < block_finish_date, account_status, 0) as account_status, withdrawal_enable, last_worldid, IF(push_device_token = '',  0, 1) AS exist_push_token, push_enable
    FROM line_account
    WHERE account_type = p_AccountType AND account_id = p_AccountID;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_mmo_account_select_check2` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `sp_mmo_account_select_check2`(
	IN  p_AccountType		INT					-- 계정 타입
,	IN 	p_AccountID			VARCHAR(128)		-- 계정 고유 값(구글/아이폰)
)
    COMMENT '계정 로그인'
BEGIN
		
	SELECT user_id, IF(now() < block_finish_date, account_status, 0) as account_status, withdrawal_enable, last_worldid, 
			IF(push_device_token = '',  0, 1) AS exist_push_token, push_enable,
            UNIX_TIMESTAMP(reg_date) AS reg_date, UNIX_TIMESTAMP(last_login_date) AS last_login_date, wemix_user_address
    FROM line_account
    -- WHERE account_type = p_AccountType AND account_id collate utf8mb4_unicode_ci = p_AccountID collate utf8mb4_unicode_ci;
    WHERE account_type = p_AccountType AND account_id = p_AccountID;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_mmo_account_select_check_quicksdk` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `sp_mmo_account_select_check_quicksdk`(
	IN  p_AccountType		INT					-- 계정 타입
,	IN 	p_ChannelCode		INT 				-- 채널 코드(ACCOUNT SUBTYPE에 저장)
,	IN 	p_AccountID			VARCHAR(128)		-- 계정 고유 값(구글/아이폰)
)
    COMMENT '계정 로그인'
BEGIN
		
	SELECT user_id, IF(now() < block_finish_date, account_status, 0) as account_status, withdrawal_enable, last_worldid, IF(push_device_token = '',  0, 1) AS exist_push_token, push_enable
    FROM line_account
    WHERE account_type = p_AccountType AND account_subtype = p_ChannelCode AND account_id = p_AccountID;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_mmo_account_select_check_quicksdk2` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `sp_mmo_account_select_check_quicksdk2`(
	IN  p_AccountType		INT					-- 계정 타입
,	IN 	p_ChannelCode		INT 				-- 채널 코드(ACCOUNT SUBTYPE에 저장)
,	IN 	p_AccountID			VARCHAR(128)		-- 계정 고유 값(구글/아이폰)
)
    COMMENT '계정 로그인'
BEGIN
		
	SELECT user_id, IF(now() < block_finish_date, account_status, 0) as account_status, withdrawal_enable, last_worldid, 
			IF(push_device_token = '',  0, 1) AS exist_push_token, push_enable, 
			UNIX_TIMESTAMP(reg_date) AS reg_date, UNIX_TIMESTAMP(last_login_date) AS last_login_date, wemix_user_address
    FROM line_account
    WHERE account_type = p_AccountType AND account_subtype = p_ChannelCode AND account_id = p_AccountID;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_mmo_account_select_gamepotsdk_userid` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `sp_mmo_account_select_gamepotsdk_userid`(
	IN  p_AccountType		INT					-- 계정 타입
,	IN 	p_AccountID			VARCHAR(128)		-- 계정 고유 ID
)
    COMMENT 'UserID 얻기'
BEGIN
	
	SELECT user_id
    FROM line_account
    WHERE account_type = p_AccountType AND account_id = p_AccountID;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_mmo_account_select_stormsdk_userid` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `sp_mmo_account_select_stormsdk_userid`(
	IN p_UserID		BIGINT	-- 게임 월드 계정 고유 번호	
)
    COMMENT '월드 user_idx로 계정 id를 얻기'
BEGIN
	SELECT account_idx		-- 게임의 계정 고유 번호
    FROM line_account_world
    WHERE game_user_idx = p_UserID;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_mmo_account_select_withdrawal` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `sp_mmo_account_select_withdrawal`(
	IN p_DayOfPast		INT 	
)
    COMMENT '탈퇴 처리가 되어야할 목록을 리턴한다.'
BEGIN

	
	UPDATE line_account
    SET withdrawal_enable = 10
    WHERE withdrawal_enable = 1 AND DATE(withdrawal_date) < DATE_SUB(NOW(), INTERVAL p_DayOfPast DAY);

	
	SELECT user_id, account_type, account_id, withdrawal_enable
    FROM line_account
    WHERE withdrawal_enable = 10;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_mmo_account_update_characterexist` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `sp_mmo_account_update_characterexist`(
	IN p_WorldID		INT		-- 월드 번호
,	IN p_GameUserID		BIGINT	-- 게임 디비 유저 고유 번호
)
    COMMENT '게임 디비 데이서 삽입 알림'
BEGIN
	DECLARE	v_errno			INT DEFAULT 0;
	DECLARE v_result 		INT DEFAULT 0;
    
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		GET CURRENT DIAGNOSTICS CONDITION 1
			v_errno = MYSQL_ERRNO;
			SET v_result := (v_errno * -1);

		SELECT v_result;
	END;
			
	-- account_world update
	UPDATE line_account_world 
	SET character_exist = 1
	WHERE world_idx = p_WorldID AND game_user_idx = p_GameUserID;
	
	-- Error Check
	IF ROW_COUNT() = 1 THEN
		COMMIT;
	ELSE
		SET v_result = 104;	-- 실패
	END IF;            
	
	SELECT v_result;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_mmo_account_update_guest_link` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `sp_mmo_account_update_guest_link`(
	IN p_UserID			BIGINT
, 	IN p_Type			TINYINT			
,	IN p_AccountID		VARCHAR(128)	
)
    COMMENT 'Guest 계정 연동하기'
BEGIN
	DECLARE	v_errno				INT DEFAULT 0;
	DECLARE v_result 			INT DEFAULT 0;
    DECLARE v_account_id		VARCHAR(128) DEFAULT '';
    DECLARE v_account_type 		TINYINT DEFAULT 0;
    DECLARE v_type_guest_android	TINYINT DEFAULT 10;	
    DECLARE v_type_guest_iso		TINYINT DEFAULT 11; 
    DECLARE v_type_google			TINYINT DEFAULT 20;	
    
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
    
    	
        SELECT account_id, account_type  INTO v_account_id, v_account_type
        FROM line_account 
        WHERE user_id = p_UserID;
        IF FOUND_ROWS() = 0 THEN
			SET v_result = 101;	
            LEAVE root;
        END IF;
        
        
		IF v_type_guest_android <> v_account_type THEN
		BEGIN
			SET v_result = 102;	
            LEAVE root;
		END;
        END IF;
        
        
        IF EXISTS (SELECT * FROM line_account WHERE account_type = v_type_google and account_id = p_AccountID) THEN
			SET v_result = 103;	
            LEAVE root;
        END IF;

        subroot:
        BEGIN
			START TRANSACTION;

			
			UPDATE line_account 
            SET account_id = p_AccountID, account_type = v_type_google, combine_date = now()
            WHERE user_id = p_UserID;
			
			
			IF ROW_COUNT() = 1 THEN
				COMMIT;
			ELSE
				SET v_result = 104;	
                ROLLBACK;
			END IF;            

		END;

    END;
	
	SELECT v_result, v_account_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_mmo_account_update_guest_link_pang` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `sp_mmo_account_update_guest_link_pang`(
	IN p_UserID			BIGINT
, 	IN p_Type			TINYINT			
,	IN p_PlatformID		TINYINT 		-- Platform(1"google", 2"facebook", 3"naver", 4"gamecenter", 5"guest")
,	IN p_AccountIDOLD	VARCHAR(256)	-- 현재 플랫폼 account id
,	IN p_AccountIDNEW	VARCHAR(256)	-- 신규 플랫폼 account id
)
    COMMENT 'Guest 계정 연동하기(PANG)'
BEGIN
	DECLARE	v_errno				INT DEFAULT 0;
	DECLARE v_result 			INT DEFAULT 0;
    DECLARE v_account_id		VARCHAR(256) DEFAULT '';
    DECLARE v_account_type 		TINYINT DEFAULT 0;

    
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
    
    	-- 계정 검색
        SELECT account_id, account_type  INTO v_account_id, v_account_type
        FROM line_account 
        WHERE user_id = p_UserID;
        IF FOUND_ROWS() = 0 THEN
			SET v_result = 101;		-- 계정 찾을수 없슴
            LEAVE root;
        END IF;
        
		-- 데이터 확인
        IF p_AccountIDOLD != v_account_id OR v_account_type != p_Type THEN
			SET v_result = 102;		-- 계정 데이터 안맞음
            LEAVE root;
        END IF;
        
        IF EXISTS (SELECT * FROM line_account WHERE account_id = p_AccountIDNEW) THEN
			SET v_result = 103;		-- 이미 연동한 계정이 존재
            LEAVE root;
        END IF;

        subroot:
        BEGIN
			START TRANSACTION;
			
			UPDATE line_account 
            SET account_id = p_AccountIDNEW, account_subtype = p_PlatformID, combine_date = now()
            WHERE user_id = p_UserID;
						
			IF ROW_COUNT() = 1 THEN
				COMMIT;
			ELSE
				SET v_result = 104;	
                ROLLBACK;
			END IF;            

		END;

    END;
	
	SELECT v_result;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_mmo_account_update_login` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `sp_mmo_account_update_login`(
	IN p_WorldID		INT			
,	IN p_UserID			BIGINT		
)
    COMMENT '로그인 날짜 Update'
BEGIN
    
    -- 마지막 로그인 시간 설정
	UPDATE line_account_world 
	SET last_login_date = now()
	WHERE account_idx = p_UserID AND world_idx = p_WorldID;
    
    -- 마지막 로그인 월드 번호 설정
    UPDATE line_account
    SET last_worldid = p_WorldID, last_login_date = now()
    WHERE user_id = p_UserID;
	
    
    -- DAU용 데이터 넣기
    INSERT IGNORE INTO _analysis_login VALUES(DATE(NOW()), p_UserID);
    
/*
	INSERT IGNORE INTO _analysis_login ( fld_date, user_id )
	SELECT DATE(last_login_date), user_id
	FROM line_account
	WHERE DATE(last_login_date) = DATE(now());
*/    
    
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_mmo_account_update_push` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `sp_mmo_account_update_push`(
	IN p_UserID			BIGINT
, 	IN p_PushEnable		TINYINT			
)
    COMMENT 'Push 동의 여부'
BEGIN
	DECLARE	v_errno				INT DEFAULT 0;
	DECLARE v_result 			INT DEFAULT 0;
    DECLARE v_push_enable		TINYINT DEFAULT 0;
    
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		GET CURRENT DIAGNOSTICS CONDITION 1
			v_errno = MYSQL_ERRNO;
			SET v_result := (v_errno * -1);
		ROLLBACK;

		SELECT v_result;
	END;
    
	UPDATE line_account 
	SET push_enable = (@push_enable := p_PushEnable) 
	WHERE user_id = p_UserID;
	
	
	IF ROW_COUNT() = 0 THEN
		SET v_result = 101;	
	ELSE
		SET v_push_enable = @push_enable;
	END IF; 
 	
	SELECT v_result, v_push_enable;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_mmo_account_update_pushinfo` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `sp_mmo_account_update_pushinfo`(
	IN p_UserID			BIGINT
,	IN p_PushKey		VARCHAR(256)	
, 	IN p_PushEnable		TINYINT			
)
    COMMENT 'Push 동의 여부'
BEGIN
	DECLARE	v_errno				INT DEFAULT 0;
	DECLARE v_result 			INT DEFAULT 0;
    
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		GET CURRENT DIAGNOSTICS CONDITION 1
			v_errno = MYSQL_ERRNO;
			SET v_result := (v_errno * -1);
		ROLLBACK;

		SELECT v_result;
	END;
    
	UPDATE line_account 
	SET push_device_token = p_PushKey, push_enable = p_PushEnable
	WHERE user_id = p_UserID;
	
	
	IF ROW_COUNT() = 0 THEN
		SET v_result = 101;	
	END IF; 
 	
	SELECT v_result;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_mmo_account_update_wemixuseraddress` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `sp_mmo_account_update_wemixuseraddress`(
	IN p_AccountID			BIGINT		-- 계정 고유 번호
,	IN p_WemixUserAddress	VARCHAR(64)	-- 위믹스 지갑 주소
)
    COMMENT '위믹스 유저 지갑 등록'
BEGIN
	DECLARE	v_errno				INT DEFAULT 0;
	DECLARE v_result 			INT DEFAULT 0;
	
	DECLARE v_wemix_user_address VARCHAR(64) DEFAULT '';
    
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
	
		-- 기등록 확인
		IF EXISTS (SELECT * FROM line_account WHERE wemix_user_address = p_WemixUserAddress) THEN 
			SET v_result = 101;	-- 이미 등록된 주소임
			LEAVE root;
		END IF;
	
		-- 현재 계정의 등록 주소 확인
		SELECT wemix_user_address INTO v_wemix_user_address
		FROM line_account
		WHERE user_id = p_AccountID;
		
		IF FOUND_ROWS() = 0 THEN
			SET v_result = 102;	-- 없는 계정임
            LEAVE root;
		END IF;
		
        IF 0 < LENGTH(v_wemix_user_address) THEN
			SET v_result = 103;	-- 이미 등록 하였습니다
            LEAVE root;
        END IF;

		UPDATE line_account 
		SET wemix_user_address = p_WemixUserAddress
		WHERE user_id = p_AccountID;
		
		IF ROW_COUNT() = 0 THEN
			SET v_result = 104;		-- 등록 실패
		END IF;	
	END;
 	
	SELECT v_result;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_mmo_account_update_withdrawal` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `sp_mmo_account_update_withdrawal`(
	IN p_UserID			BIGINT
,	IN p_Withdrawal		TINYINT 	
)
    COMMENT '탈퇴 설정'
BEGIN
	DECLARE	v_errno				INT DEFAULT 0;
	DECLARE v_result 			INT DEFAULT 0;
    DECLARE v_withdrawal		TINYINT DEFAULT 0;
    
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
		SELECT withdrawal_enable INTO v_withdrawal
		FROM line_account
		WHERE user_id = p_UserID;
		
		IF found_rows() = 0 THEN
			SET v_result = 101;
            LEAVE root;
		END IF;
        
        IF v_withdrawal = p_Withdrawal THEN
            LEAVE root;
        END IF;

		UPDATE line_account 
		SET withdrawal_enable = p_Withdrawal, withdrawal_date = IF ( p_Withdrawal <> 0, now(), withdrawal_date)
		WHERE user_id = p_UserID;

		
		IF ROW_COUNT() = 0 THEN
			SET v_result = 102;	
		END IF;	
	END;
 	
	SELECT v_result;
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

-- Dump completed on 2025-07-31 17:39:33
