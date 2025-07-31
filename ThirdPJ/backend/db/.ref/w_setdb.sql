-- MySQL dump 10.13  Distrib 5.7.40, for Win64 (x86_64)
--
-- Host: localhost    Database: w_setdb
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
-- Table structure for table `ip_block`
--

DROP TABLE IF EXISTS `ip_block`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ip_block` (
  `ip_address` varchar(16) NOT NULL,
  `reason` int(11) NOT NULL,
  `block_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `block_finish_time` datetime NOT NULL,
  PRIMARY KEY (`ip_address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `manage_info`
--

DROP TABLE IF EXISTS `manage_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `manage_info` (
  `fld_ID` int(11) NOT NULL AUTO_INCREMENT COMMENT '순서 번호',
  `client_version` varchar(128) NOT NULL DEFAULT '1.0.0.0' COMMENT '클라이언트 버전',
  `construction` tinyint(4) NOT NULL DEFAULT '0' COMMENT '점검중 여부',
  `construction_starttime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `construction_endtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`fld_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COMMENT='점검 접속 가능 IP 목록';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `manage_whiteip_list`
--

DROP TABLE IF EXISTS `manage_whiteip_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `manage_whiteip_list` (
  `fld_ID` int(11) NOT NULL AUTO_INCREMENT COMMENT '순서 번호',
  `fld_Address` varchar(128) DEFAULT NULL COMMENT 'IP Address',
  `fld_Desc` varchar(128) DEFAULT NULL COMMENT '비고',
  PRIMARY KEY (`fld_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COMMENT='점검 접속 가능 IP 목록';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `setting_global_common_gate`
--

DROP TABLE IF EXISTS `setting_global_common_gate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `setting_global_common_gate` (
  `set_index` int(11) NOT NULL AUTO_INCREMENT COMMENT '번호',
  `port_acceptor_user_lg_l4` int(11) NOT NULL DEFAULT '0' COMMENT '유저 연결 포트',
  `address_pri_redis_account` varchar(256) NOT NULL DEFAULT '' COMMENT '계정 Redis 연결 주소',
  `port_connector_redis_account` int(11) NOT NULL DEFAULT '0' COMMENT '계정 Redis 연결 포트',
  `address_acceptor_gamelog` varchar(256) NOT NULL COMMENT 'tcp 게임 로그 접속 IP',
  `port_acceptor_gamelog` int(11) NOT NULL COMMENT 'tcp 게임 로그 접속 Port',
  PRIMARY KEY (`set_index`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COMMENT='Account 공용세팅';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `setting_global_common_platform`
--

DROP TABLE IF EXISTS `setting_global_common_platform`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `setting_global_common_platform` (
  `platform_type` int(11) NOT NULL,
  `url_type` int(11) NOT NULL,
  `param_int_1` int(11) NOT NULL DEFAULT '0' COMMENT 'integer 파라메터',
  `param_int_2` int(11) NOT NULL DEFAULT '0' COMMENT 'integer 파라메터',
  `param_int_3` int(11) NOT NULL DEFAULT '0' COMMENT 'integer 파라메터',
  `param_str_1` varchar(128) NOT NULL DEFAULT '' COMMENT '스트링 파라메터',
  `param_str_2` varchar(128) NOT NULL DEFAULT '' COMMENT '스트링 파라메터',
  `param_str_3` varchar(128) NOT NULL DEFAULT '' COMMENT '스트링 파라메터',
  `param_str_4` varchar(128) NOT NULL DEFAULT '' COMMENT '스트링 파라메터',
  `param_str_5` varchar(128) NOT NULL DEFAULT '' COMMENT '스트링 파라메터',
  `desc` varchar(256) NOT NULL DEFAULT '' COMMENT 'description',
  PRIMARY KEY (`platform_type`,`url_type`,`param_int_1`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='platform or sdk 부가 정보';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `setting_global_common_url`
--

DROP TABLE IF EXISTS `setting_global_common_url`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `setting_global_common_url` (
  `platform_type` int(11) NOT NULL COMMENT 'google, onestore, quicksdk 등등 sdk 종류\n',
  `url_type` int(11) NOT NULL COMMENT 'Auth(인증), IAP(결제) 등등',
  `url_sub_type` int(11) NOT NULL DEFAULT '0' COMMENT 'token, recipe, consume 등등 서브 타입 ',
  `url_string` varchar(256) NOT NULL DEFAULT '',
  `desc` varchar(256) NOT NULL DEFAULT '',
  PRIMARY KEY (`platform_type`,`url_type`,`url_sub_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='URL 정보';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `setting_global_dbs`
--

DROP TABLE IF EXISTS `setting_global_dbs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `setting_global_dbs` (
  `fld_type` int(11) NOT NULL COMMENT '서버 타입(1:globaldb,2:gamedb,3:gamelogdb,4:auctiondb,5:gmtooldb,6:guildchatdb,7:guilddb,8:rankdb',
  `fld_name` varchar(45) NOT NULL COMMENT '이름(desc)',
  `fld_address` varchar(128) DEFAULT NULL COMMENT '접속 주소',
  `fld_port` int(11) NOT NULL COMMENT '접속 포트',
  `fld_uid` varchar(45) NOT NULL COMMENT 'SQL 접속 ID',
  `fld_pwd` varchar(45) NOT NULL COMMENT 'SQL 접속 비번',
  `fld_database` varchar(45) NOT NULL COMMENT 'SQL Database명',
  `fld_use` smallint(6) NOT NULL COMMENT '사용여부(0:미사용, 1:사용)',
  `fld_reg_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '등록일시',
  PRIMARY KEY (`fld_type`),
  KEY `IX_fld_use` (`fld_use`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `setting_global_gamelog_mongodb`
--

DROP TABLE IF EXISTS `setting_global_gamelog_mongodb`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `setting_global_gamelog_mongodb` (
  `world_id` int(11) NOT NULL DEFAULT '0' COMMENT '월드 고유번호(0:default)',
  `desc` varchar(45) NOT NULL COMMENT '이름(desc)',
  `address_mongodb_ip` varchar(128) NOT NULL COMMENT 'mongodb ip 주소',
  `port_mongodb` int(11) NOT NULL COMMENT 'mongodb port',
  `usable` smallint(6) NOT NULL COMMENT '사용여부(0:미사용, 1:사용)',
  `reg_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '등록일시',
  PRIMARY KEY (`world_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='TCP GameLog 리시버에서 저장하는 Mongo DB 정보';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `setting_global_logingatemanage`
--

DROP TABLE IF EXISTS `setting_global_logingatemanage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `setting_global_logingatemanage` (
  `server_key` int(11) NOT NULL COMMENT '서버 세션키',
  `address_pri_acceptor_ip` varchar(256) NOT NULL,
  `port_acceptor_logingate` int(11) NOT NULL DEFAULT '0' COMMENT '로그인 게이트서버 연결 포트',
  `port_acceptor_login` int(11) NOT NULL DEFAULT '0' COMMENT '로그인 서버 연결 포트',
  `port_acceptor_web` int(11) NOT NULL DEFAULT '0' COMMENT '결제 관련 API 제공(from Web) 포트',
  `port_acceptor_admin` int(11) NOT NULL DEFAULT '0' COMMENT '운영 관련 포트',
  PRIMARY KEY (`server_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='LoginGateManage Server 공용세팅';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `setting_world_chat`
--

DROP TABLE IF EXISTS `setting_world_chat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `setting_world_chat` (
  `world_idx` int(11) NOT NULL COMMENT '월드 번호',
  `server_key` int(11) NOT NULL COMMENT '서버 세션키',
  `address_pri_acceptor_ip` varchar(256) NOT NULL COMMENT '내부 ip',
  `address_pub_acceptor_ip` varchar(256) NOT NULL DEFAULT '' COMMENT '유저 연결 Public-IP 저장(간혹 acceptorUser 와 다를 경우가 있기 때문에<포트 포워딩 등..>)',
  `address_pub_acceptor_ip6` varchar(256) NOT NULL DEFAULT '' COMMENT 'ipv6 주소',
  `port_acceptor_user` int(11) NOT NULL DEFAULT '0' COMMENT '유저 연결 포트',
  `port_acceptor_server_mmo` int(11) NOT NULL DEFAULT '0' COMMENT 'MMO서버들 연결 포트',
  `port_acceptor_server_pm` int(11) NOT NULL DEFAULT '0',
  `port_acceptor_server_admin` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`server_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='채팅 서버 셋팅';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `setting_world_common`
--

DROP TABLE IF EXISTS `setting_world_common`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `setting_world_common` (
  `world_idx` int(11) NOT NULL COMMENT '월드번호',
  `country` int(11) NOT NULL DEFAULT '0' COMMENT '국가 설정(0:GLOBAL, 1:KR, 2:TW...)',
  `world_type` int(11) NOT NULL DEFAULT '0',
  `world_name` varchar(64) NOT NULL DEFAULT '',
  `world_event_tab` tinyint(4) NOT NULL DEFAULT '0' COMMENT '1 : 신규\n2 : 추천\n3 : 일반\n4 : 테스트\n5 : 이벤트',
  `world_max_user_count` int(11) DEFAULT '0' COMMENT '월드 max 유저 카운트',
  `world_client_version` int(11) NOT NULL DEFAULT '0' COMMENT '클라이언트 목록 그룹을 위해 사용\n0: globaldb.manage_info의 값으로 자동 설정\n0<>: 해당 값으로 버전 그룹핑',
  `use_admin_cmd` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`world_idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Server 공용세팅';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `setting_world_common_subworld`
--

DROP TABLE IF EXISTS `setting_world_common_subworld`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `setting_world_common_subworld` (
  `world_idx` int(11) NOT NULL DEFAULT '0',
  `sub_world_idx` int(11) NOT NULL DEFAULT '0',
  `sub_world_name` varchar(64) NOT NULL DEFAULT '',
  `sub_world_event_tab` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`sub_world_idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='서버 통합 후 연결가능하게 할 월드 설정';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `setting_world_dbs`
--

DROP TABLE IF EXISTS `setting_world_dbs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `setting_world_dbs` (
  `fld_world_idx` int(11) NOT NULL DEFAULT '0' COMMENT '월드 고유번호',
  `fld_type` int(11) NOT NULL COMMENT '서버 타입(1:globaldb,2:gamedb,3:gamelogdb,4:auctiondb,5:gmtooldb,6:guildchatdb,7:guilddb,8:rankdb',
  `fld_name` varchar(45) NOT NULL COMMENT '이름(desc)',
  `fld_address` varchar(128) NOT NULL COMMENT '접속 주소',
  `fld_address_pub` varchar(128) NOT NULL DEFAULT '' COMMENT '디비 외부 주소',
  `fld_port` int(11) NOT NULL COMMENT '접속 포트',
  `fld_uid` varchar(45) NOT NULL COMMENT 'SQL 접속 ID',
  `fld_pwd` varchar(45) NOT NULL COMMENT 'SQL 접속 비번',
  `fld_database` varchar(45) NOT NULL COMMENT 'SQL Database명',
  `fld_use` smallint(6) NOT NULL COMMENT '사용여부(0:미사용, 1:사용)',
  `fld_reg_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '등록일시',
  PRIMARY KEY (`fld_world_idx`,`fld_type`),
  KEY `IX_fld_use` (`fld_use`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `setting_world_field`
--

DROP TABLE IF EXISTS `setting_world_field`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `setting_world_field` (
  `world_idx` int(11) NOT NULL COMMENT '월드 번호',
  `server_key` int(11) NOT NULL COMMENT '서버 세션키',
  `address_pub_acceptor_ip` varchar(256) NOT NULL DEFAULT '' COMMENT '유저 연결 Public-IP 저장(간혹 acceptorUser 와 다를 경우가 있기 때문에<포트 포워딩 등..>)',
  `address_pub_acceptor_ip6` varchar(256) NOT NULL DEFAULT '' COMMENT 'ipv6 주소',
  `port_acceptor_user` int(11) NOT NULL,
  PRIMARY KEY (`server_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='FieldServer 개별세팅';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `setting_world_fieldmanage`
--

DROP TABLE IF EXISTS `setting_world_fieldmanage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `setting_world_fieldmanage` (
  `world_idx` int(11) NOT NULL COMMENT '번호',
  `server_key` int(11) NOT NULL COMMENT '서버 세션키',
  `address_pri_l4` varchar(256) NOT NULL DEFAULT '',
  `port_acceptor_lobby` int(11) NOT NULL DEFAULT '0' COMMENT '로비서버 연결 포트',
  `port_acceptor_field` int(11) NOT NULL DEFAULT '0' COMMENT '필드서버 연결 포트',
  `port_acceptor_raid` int(11) NOT NULL DEFAULT '0' COMMENT '레이드서버 연결 포트',
  `port_acceptor_weblobby` int(11) NOT NULL DEFAULT '0' COMMENT '웹로비서버 연결 포트',
  PRIMARY KEY (`world_idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='FieldManage Server 공용세팅';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `setting_world_lobby`
--

DROP TABLE IF EXISTS `setting_world_lobby`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `setting_world_lobby` (
  `world_idx` int(11) NOT NULL COMMENT '월드 번호',
  `server_key` int(11) NOT NULL COMMENT '서버 세션키',
  `address_pub_acceptor_ip` varchar(256) NOT NULL DEFAULT '' COMMENT '유저 연결 Public-IP 저장(간혹 acceptorUser 와 다를 경우가 있기 때문에<포트 포워딩 등..>)',
  `address_pub_acceptor_ip6` varchar(256) NOT NULL DEFAULT '' COMMENT 'ipv6',
  `port_acceptor_user` int(11) NOT NULL DEFAULT '0',
  `address_pri_l4` varchar(256) NOT NULL DEFAULT '',
  `port_acceptor_lobby` int(11) NOT NULL DEFAULT '0' COMMENT '로비서버 연결 포트',
  `port_acceptor_field` int(11) NOT NULL DEFAULT '0' COMMENT '필드서버 연결 포트',
  `port_acceptor_raid` int(11) NOT NULL DEFAULT '0' COMMENT '레이드서버 연결 포트',
  `port_acceptor_weblobby` int(11) NOT NULL DEFAULT '0' COMMENT '웹로비서버 연결 포트',
  PRIMARY KEY (`server_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='LobbyServer 세팅';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `setting_world_login`
--

DROP TABLE IF EXISTS `setting_world_login`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `setting_world_login` (
  `world_idx` int(11) NOT NULL COMMENT '월드 번호',
  `server_key` int(11) NOT NULL COMMENT '서버 세션키',
  `address_pri_l4` varchar(256) NOT NULL DEFAULT '',
  `port_acceptor_game` int(11) NOT NULL DEFAULT '0',
  `port_acceptor_lobby` int(11) NOT NULL DEFAULT '0' COMMENT '로비서버 연결 포트',
  `port_acceptor_field` int(11) NOT NULL DEFAULT '0' COMMENT '필드서버 연결 포트',
  `port_acceptor_raid` int(11) NOT NULL DEFAULT '0' COMMENT '레이드서버 연결 포트',
  `port_acceptor_chat` int(11) NOT NULL DEFAULT '0' COMMENT '채팅서버 연결 포트',
  `port_acceptor_weblobby` int(11) NOT NULL DEFAULT '0' COMMENT '웹로비서버 연결 포트',
  `port_acceptor_manage` int(11) NOT NULL DEFAULT '0' COMMENT '매니저 서버들 연결 포트',
  PRIMARY KEY (`server_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='LoginServer 세팅';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `setting_world_raid`
--

DROP TABLE IF EXISTS `setting_world_raid`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `setting_world_raid` (
  `world_idx` int(11) NOT NULL COMMENT '월드 번호',
  `server_key` int(11) NOT NULL COMMENT '서버 세션키',
  `address_pub_acceptor_ip` varchar(256) NOT NULL DEFAULT '' COMMENT '유저 연결 Public-IP 저장(간혹 acceptorUser 와 다를 경우가 있기 때문에<포트 포워딩 등..>)',
  `address_pub_acceptor_ip6` varchar(256) NOT NULL DEFAULT '' COMMENT 'ipv6',
  `port_acceptor_user` int(11) NOT NULL,
  `address_pri_l4` varchar(256) NOT NULL DEFAULT '내부 ip',
  `port_acceptor_lobby` int(11) NOT NULL DEFAULT '0' COMMENT '로비서버 연결 포트',
  `port_acceptor_field` int(11) NOT NULL DEFAULT '0' COMMENT '필드서버 연결 포트',
  `port_acceptor_raid` int(11) NOT NULL DEFAULT '0' COMMENT '레이드서버 연결 포트',
  `port_acceptor_weblobby` int(11) NOT NULL DEFAULT '0' COMMENT '웹로비서버 연결 포트',
  PRIMARY KEY (`server_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='RaidServer 세팅';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `setting_world_redis`
--

DROP TABLE IF EXISTS `setting_world_redis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `setting_world_redis` (
  `fld_world_idx` int(11) NOT NULL DEFAULT '0' COMMENT '월드 고유번호',
  `fld_type` int(11) NOT NULL COMMENT '서버 타입(1:partyredis,2:guildredis,3:rankredis',
  `fld_name` varchar(45) NOT NULL COMMENT '이름(desc)',
  `fld_address` varchar(128) NOT NULL,
  `fld_port` int(11) NOT NULL,
  `fld_use` smallint(6) NOT NULL COMMENT '사용여부(0:미사용, 1:사용)',
  `fld_reg_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '등록일시',
  PRIMARY KEY (`fld_world_idx`,`fld_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `setting_world_weblobby`
--

DROP TABLE IF EXISTS `setting_world_weblobby`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `setting_world_weblobby` (
  `world_idx` int(11) NOT NULL COMMENT '월드 번호',
  `server_key` int(11) NOT NULL COMMENT '서버 세션키',
  `address_pri_acceptor_ip` varchar(256) NOT NULL,
  `address_pub_acceptor_ip` varchar(256) NOT NULL DEFAULT '' COMMENT '유저 연결 Public-IP 저장(간혹 acceptorUser 와 다를 경우가 있기 때문에<포트 포워딩 등..>)',
  `address_pub_acceptor_ip6` varchar(256) NOT NULL DEFAULT '' COMMENT 'ipv6',
  `port_acceptor_user` int(11) NOT NULL DEFAULT '0' COMMENT '유저 연결 포트',
  `port_acceptor_game` int(11) NOT NULL DEFAULT '0' COMMENT '서버들 연결 포트',
  `port_acceptor_servers` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`server_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='WebLobbyServer 세팅';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'w_setdb'
--
/*!50003 DROP PROCEDURE IF EXISTS `gsp_admin_ipblock_delete` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `gsp_admin_ipblock_delete`(
	IN p_Address		VARCHAR(16)	-- IP
)
    COMMENT 'IP 블럭 해제'
BEGIN
	DECLARE v_result 		INT DEFAULT 101;	-- 실패
    
    
    root:
    BEGIN
    
		IF NOT EXISTS (SELECT 1 FROM ip_block WHERE ip_address = p_Address) THEN
			SET v_result = 102;	-- 없으므로 그냥 성공으로 리턴
			LEAVE root;		
		END IF;
		
		DELETE FROM ip_block
		WHERE ip_address = p_Address;

		-- Error Check
		IF ROW_COUNT() > 0 THEN
			SET v_result = 0;	-- 성공
		END IF;
        
	END;
	
	SELECT v_result;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `gsp_admin_ipblock_update` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `gsp_admin_ipblock_update`(
	IN p_Reason			INT			-- 사유
,	IN p_Address		VARCHAR(16)	-- IP
,	IN p_BlockHourTime	INT			-- 블럭 시간
)
    COMMENT 'IP 블럭 하기'
BEGIN
	DECLARE v_result 		INT DEFAULT 101;	-- 실패

	INSERT INTO ip_block (ip_address, reason, block_time, block_finish_time) VALUES (p_Address, p_Reason, NOW(), DATE_ADD(NOW(), INTERVAL p_BlockhourTime HOUR))
		ON DUPLICATE KEY UPDATE reason = p_Reason, block_time = now(), block_finish_time = DATE_ADD(NOW(), INTERVAL p_BlockhourTime HOUR);
    
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
/*!50003 DROP PROCEDURE IF EXISTS `gsp_admin_manageinfo_select_clientversion` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `gsp_admin_manageinfo_select_clientversion`(
)
    COMMENT '클라이언트 버전 정보'
BEGIN
	SELECT client_version FROM manage_info;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `gsp_admin_manageinfo_update_clientversion` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `gsp_admin_manageinfo_update_clientversion`(
	IN p_ClientVersion		VARCHAR(32)	-- 버전
)
    COMMENT '클라이언트 버전 정보 Update'
BEGIN
    
	DECLARE	v_errno			INT DEFAULT 0;
	DECLARE v_result 		INT DEFAULT 0;
    
    DECLARE v_clientversion	VARCHAR(32) DEFAULT '';
    
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		GET CURRENT DIAGNOSTICS CONDITION 1
			v_errno = MYSQL_ERRNO;
			SET v_result := (v_errno * -1);
		ROLLBACK;

		SELECT v_result, v_clientversion;
	END;
    

	START TRANSACTION;
    
    root:
    BEGIN
		-- 설정 값 얻어오기
		SELECT client_version INTO v_clientversion FROM manage_info;
        IF found_rows() = 0 THEN
			SET v_result = 101;
			LEAVE root;
        END IF;
        
        IF v_clientversion = p_ClientVersion THEN
			LEAVE root;
        END IF;
        
		-- construction Update
		UPDATE manage_info
		SET client_version = p_ClientVersion;

		-- Error Check
		IF ROW_COUNT() = 0 THEN
			SET v_result = 102;
		END IF;
		
        -- 설정 값 다시 얻기
		SELECT client_version INTO v_clientversion FROM manage_info;
        IF found_rows() = 0 THEN
			SET v_result = 103;
			LEAVE root;
        END IF;
        
	END;
    
	IF v_result = 0 THEN 
		COMMIT;
    ELSE
		ROLLBACK;
	END IF;
    
	
	SELECT v_result, v_clientversion;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `gsp_admin_manageinfo_update_construction` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `gsp_admin_manageinfo_update_construction`(
	IN p_StartTime			BIGINT 	-- 시작 시간
,	IN p_EndTime			BIGINT	-- 종료 시간
)
    COMMENT '점검 상태 변경'
BEGIN
    
	DECLARE	v_errno			INT DEFAULT 0;
	DECLARE v_result 		INT DEFAULT 0;

    DECLARE v_starttime		BIGINT DEFAULT UNIX_TIMESTAMP(NOW());
    DECLARE v_endtime		BIGINT DEFAULT UNIX_TIMESTAMP(NOW());
    
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		GET CURRENT DIAGNOSTICS CONDITION 1
			v_errno = MYSQL_ERRNO;
			SET v_result := (v_errno * -1);
		ROLLBACK;

		SELECT v_result, v_starttime, v_endtime;
	END;
    

	START TRANSACTION;
    
    root:
    BEGIN
    
		-- 설정 값 얻어오기
		SELECT UNIX_TIMESTAMP(construction_starttime), UNIX_TIMESTAMP(construction_endtime)
        INTO v_starttime, v_endtime
        FROM manage_info;
        IF found_rows() = 0 THEN
			SET v_result = 101;
			LEAVE root;
        END IF;
        
        IF v_starttime = p_StartTime AND v_endtime = p_EndTime THEN
			LEAVE root;
        END IF;
        
		-- construction Update
		UPDATE manage_info
		SET construction_starttime = FROM_UNIXTIME(p_StartTime), construction_endtime = FROM_UNIXTIME(p_EndTime);

		-- Error Check
		IF ROW_COUNT() = 0 THEN
			SET v_result = 102;
		END IF;
		
        -- 설정 값 다시 얻기
		SELECT UNIX_TIMESTAMP(construction_starttime), UNIX_TIMESTAMP(construction_endtime)
        INTO v_starttime, v_endtime
        FROM manage_info;
        IF found_rows() = 0 THEN
			SET v_result = 103;
			LEAVE root;
        END IF;
        
	END;
    
	IF v_result = 0 THEN 
		COMMIT;
    ELSE
		ROLLBACK;
	END IF;
    
	
	SELECT v_result, v_starttime, v_endtime;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `gsp_mmo_manageinfo_select` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `gsp_mmo_manageinfo_select`(
)
    COMMENT '점검 정보 가져오기'
BEGIN
	DECLARE nowTime TIMESTAMP DEFAULT NOW();

	SELECT IF(construction_starttime < nowTime AND nowTime < construction_endtime, 1, 0) as construction, 
		UNIX_TIMESTAMP(construction_starttime) as construction_starttime, 
		UNIX_TIMESTAMP(construction_endtime) as construction_endtime
	FROM manage_info;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `gsp_mmo_manage_whiteip_list` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `gsp_mmo_manage_whiteip_list`(
)
    COMMENT '점검시 접속 가능 목록'
BEGIN
 
	SELECT fld_Address
	FROM manage_whiteip_list;		
    
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `gsp_select_dbs` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `gsp_select_dbs`()
BEGIN
	-- globaldb 접속 정보
	SELECT fld_name, fld_address, fld_port, fld_uid, fld_pwd, fld_database
	FROM setting_global_dbs
	WHERE fld_type = 1 AND fld_use = 1;    
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `gsp_select_setting` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `gsp_select_setting`(
	IN p_type			INT 	-- 종류(0:게임로그, 1:로그인게이트, 2:로그인, 11:로그인게이트매니지)
,	IN p_server_key		INT		-- 서버 세션키
)
BEGIN

    /*******************************************
    / 변수 정의
    ********************************************/ 
    
    -- 레디스
    DECLARE v_address_pri_redis_account			VARCHAR(256) DEFAULT '';	-- 계정 REDIS IP ADDRESS
    DECLARE v_port_connector_redis_account		INT DEFAULT 0;				-- 계정 REDIS 포트
    
    -- 운영 관련
    DECLARE v_client_version					VARCHAR(128) DEFAULT '100.100.100.100';	-- 클라이언트 버전    
    
    -- 로그 관련
    DECLARE v_address_acceptor_gamelog			VARCHAR(256) DEFAULT '';	-- 게임로그 리시버 접속 IP
    DECLARE v_port_acceptor_gamelog				INT DEFAULT 0;				-- 게임로그 리시버 접속 PORT
    
    -- 원스토어 결제 관련
    DECLARE v_onestore_iap_packagename			VARCHAR(256) DEFAULT '';	-- 원스토어 App ID
    DECLARE v_onestore_iap_token_url			VARCHAR(256) DEFAULT '';	-- 원스토어 token 발급 URL
    DECLARE v_onestore_iap_recipe_url			VARCHAR(256) DEFAULT '';	-- 원스토어 검증 URL    
    DECLARE v_onestore_iap_consume_url			VARCHAR(256) DEFAULT '';	-- 원스토어 소비 URL    
    DECLARE v_onestore_iap_client_id			VARCHAR(256) DEFAULT '';	-- 원스토어 검증위한 ID   
    DECLARE v_onestore_iap_client_secret		VARCHAR(256) DEFAULT '';	-- 원스토어 검증위한 비밀번호
    
    -- 구글 결제 관련
    DECLARE v_google_iap_pkcs12_filename		VARCHAR(256) DEFAULT '';	-- pkcs12 파일명
    DECLARE v_google_iap_token_url				VARCHAR(256) DEFAULT '';	-- 토큰을 얻기위한 url
    DECLARE v_google_iap_serviceaccount			VARCHAR(256) DEFAULT '';	-- 서비스 계정 ID(email)
    DECLARE v_google_iap_client_id				VARCHAR(256) DEFAULT '';	-- 검증 연결 계정 id
    DECLARE v_google_iap_client_secret			VARCHAR(256) DEFAULT '';	-- 검증 연결 계정 비밀번호
    DECLARE v_google_iap_verify_url				VARCHAR(256) DEFAULT '';	-- 영수증 검증 URL
    
   
    -- 로그인 게이트 매니저 포트
    DECLARE v_lgm_port_acceptor_logingate		INT DEFAULT 0;
    DECLARE v_lgm_port_acceptor_login			INT DEFAULT 0;
    
    -- 로그인 게이트 매니저 
    DECLARE v_lgm_address_pri_l4				VARCHAR(256) CHARACTER SET utf8 DEFAULT '';

    
     /*******************************************
    / (0) Acceptor 포트 정보 설정
    ********************************************/    
    
    -- 공용 셋팅
 	SELECT address_pri_redis_account, port_connector_redis_account, address_acceptor_gamelog, port_acceptor_gamelog
    INTO v_address_pri_redis_account, v_port_connector_redis_account, v_address_acceptor_gamelog, v_port_acceptor_gamelog
    FROM setting_global_common_gate;
       
    
 	-- 로그인 게이트 서버, 로그인 게이트 매니저
	SELECT port_acceptor_logingate, port_acceptor_login, address_pri_acceptor_ip
    INTO v_lgm_port_acceptor_logingate, v_lgm_port_acceptor_login, v_lgm_address_pri_l4
	FROM setting_global_logingatemanage; 
   
    
    -- 클라이언트 버전 셋팅
    SELECT client_version 
    INTO v_client_version
    FROM manage_info;
    
    
    
    
    
    /*******************************************
    / (1) 게임로그 리시버 서버 관련 셋팅
    ********************************************/   
    IF p_type = 0 THEN
    BEGIN
		-- TCP 게임 로그 접속 관련
		SELECT address_acceptor_gamelog, port_acceptor_gamelog
		FROM setting_global_common_gate;
        
		-- 몽고디비 목록
		SELECT world_id, address_mongodb_ip, port_mongodb
        FROM setting_global_gamelog_mongodb WHERE usable = 1;
    END;
    
    /*******************************************
    / (1) 로그인 게이트 서버 관련 셋팅
    ********************************************/   
	ELSEIF p_type = 1 THEN
    BEGIN 
		-- 로그인 게이트 서버의 셋팅을 읽어온다.
		SELECT	port_acceptor_user_lg_l4,
				v_lgm_address_pri_l4, v_lgm_port_acceptor_logingate,
                address_pri_redis_account, port_connector_redis_account,
				v_client_version
		FROM setting_global_common_gate;
        
        -- common_url
        SELECT platform_type, url_type, url_sub_type, url_string
        FROM setting_global_common_url;
        
        -- common_platform
        SELECT platform_type, url_type, param_int_1, param_int_2, param_int_3, param_str_1, param_str_2, param_str_3, param_str_4, param_str_5
        FROM setting_global_common_platform;
        
        -- ip_block
        SELECT ip_address, reason, UNIX_TIMESTAMP(block_finish_time) as block_finish_time
        FROM ip_block
        WHERE now() < block_finish_time;
    END;

    /*******************************************
    / (3) 로그인 서버 관련 셋팅
    ********************************************/
    ELSEIF p_type = 2 THEN
    BEGIN    
		-- 로그인 서버의 셋팅을 읽어온다.
		SELECT	v_lgm_address_pri_l4, v_lgm_port_acceptor_login,
				address_pri_redis_account, port_connector_redis_account,
                v_client_version
		FROM setting_global_common_gate;
		
        -- common_url
        SELECT platform_type, url_type, url_sub_type, url_string
        FROM setting_global_common_url;
        
        -- common_platform
        SELECT platform_type, url_type, param_int_1, param_int_2, param_int_3, param_str_1, param_str_2, param_str_3, param_str_4, param_str_5
        FROM setting_global_common_platform;
    END;
    
    /*******************************************
    / (2) 로그인 게이트 매니지 서버 관련 셋팅
    ********************************************/    
    ELSEIF p_type = 11 THEN
    BEGIN    
		-- 로그인 게이트 매니지 서버의 셋팅을 읽어온다.
		SELECT	port_acceptor_logingate, port_acceptor_login, port_acceptor_web, port_acceptor_admin,
				v_address_pri_redis_account, v_port_connector_redis_account,
                address_pri_acceptor_ip
		FROM setting_global_logingatemanage
		WHERE server_key = p_server_key; 
    END;
    END IF;
    
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `ssp_insert_setting` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `ssp_insert_setting`(
	IN p_WorldID				INT					-- 월드 구분자
,	IN p_ServerName				varchar(128)		-- 서버 이름
,	IN p_WindowPrivate			varchar(128)		-- 게임 서버 내부 IP
,	IN p_WindowPublic			varchar(128)		-- 게임 서버 공인 IP
,	IN p_WindowPublic6			varchar(128)		-- 게임 서버 공인 IPV6
,	IN p_LinuxGamePrivate		varchar(128)		-- 리눅스 서버 내부 IP(게임)
,	IN p_LinuxAccountPrivate	varchar(128)		-- 리눅스 서버 내부 IP(계정)
)
BEGIN

    /*******************************************
    / 변수 정의
    ********************************************/ 
    -- 포트에 반영되는 월드 정보 
	DECLARE v_Port_Prefix		INT DEFAULT 0;
    DECLARE v_World_Pre			VARCHAR(8) DEFAULT '';
    
	SET v_Port_Prefix = p_WorldID * 100;

	SET v_World_Pre = concat('w', LPAD(p_WorldID, 2, '0'));


    /*******************************************
    / (0) 셋팅 설정
    ********************************************/    
    INSERT INTO `setting_world_chat` VALUES (p_WorldID, 40040 + v_Port_Prefix, p_WindowPrivate, p_WindowPublic, p_WindowPublic6,
										40041 + v_Port_Prefix, 40042 + v_Port_Prefix, 40044 + v_Port_Prefix, 40045 + v_Port_Prefix);
    
    INSERT INTO `setting_world_common` VALUES (p_WorldID, 0, 0, p_ServerName, 1, 2000, 0, 1);
    
    INSERT INTO `setting_world_field` VALUES (p_WorldID, 40030 + v_Port_Prefix, p_WindowPublic, p_WindowPublic6, 40030 + v_Port_Prefix);
    
    INSERT INTO `setting_world_fieldmanage` VALUES (p_WorldID, 40070 + v_Port_Prefix, p_WindowPrivate, 
												40071 + v_Port_Prefix, 40072 + v_Port_Prefix, 40073 + v_Port_Prefix, 40074 + v_Port_Prefix);
    
    INSERT INTO `setting_world_lobby` VALUES (p_WorldID, 40020 + v_Port_Prefix, p_WindowPublic, p_WindowPublic6, 40020 + v_Port_Prefix, 
										p_WindowPrivate, 40061 + v_Port_Prefix, 40061 + v_Port_Prefix, 40061 + v_Port_Prefix, 40061 + v_Port_Prefix);
    
    INSERT INTO `setting_world_login` VALUES (p_WorldID, 40000 + v_Port_Prefix, p_WindowPrivate, 40011 + v_Port_Prefix, 40010 + v_Port_Prefix, 
											40012 + v_Port_Prefix, 40013 + v_Port_Prefix, 40014 + v_Port_Prefix, 40015 + v_Port_Prefix, 40016 + v_Port_Prefix);

	INSERT INTO `setting_world_raid` VALUES (p_WorldID, 40090 + v_Port_Prefix, p_WindowPublic, p_WindowPublic6, 40090 + v_Port_Prefix,
									p_WindowPrivate, 40081 + v_Port_Prefix, 40081 + v_Port_Prefix, 40081 + v_Port_Prefix, 40081 + v_Port_Prefix);
        
    INSERT INTO `setting_world_weblobby` VALUES (p_WorldID, 40028 + v_Port_Prefix, p_WindowPrivate, p_WindowPublic, p_WindowPublic6, 
											40028 + v_Port_Prefix, 40065 + v_Port_Prefix, 40095 + v_Port_Prefix);
    
    
    
    INSERT INTO `setting_world_dbs` VALUES (p_WorldID, 4, 'auction sql', p_LinuxGamePrivate, 3306,'stormgames','stormgames', concat(v_World_Pre, '_gamedb'),1,'2022-03-03 16:00:00'),
										(p_WorldID, 2, 'game sql', p_LinuxGamePrivate, 3306,'stormgames','stormgames',concat(v_World_Pre, '_gamedb'),1,'2022-03-03 16:00:00'),
										(p_WorldID, 7, 'guild sql', p_LinuxGamePrivate, 3306,'stormgames','stormgames',concat(v_World_Pre, '_gamedb'),1,'2022-03-03 16:00:00'),
										(p_WorldID, 8, 'rank sql', p_LinuxGamePrivate, 3306,'stormgames','stormgames',concat(v_World_Pre, '_gamedb'),1,'2022-03-03 16:00:00');
    
    INSERT INTO `setting_world_redis` VALUES (p_WorldID, 1, 'party redis', p_LinuxGamePrivate, 6379, 1, '2022-03-03 16:00:00'),
										(p_WorldID, 3, 'rank redis', p_LinuxGamePrivate, 6379, 1, '2022-03-03 16:00:00'),
										(p_WorldID, 7, 'combat redis', p_LinuxGamePrivate, 6379, 1, '2022-03-03 16:00:00');
    
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `ssp_select_dbs` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `ssp_select_dbs`(
	IN p_type		INT	-- SQL 타입
)
BEGIN
	SELECT fld_name, fld_address, fld_port, fld_uid, fld_pwd, fld_database
    FROM setting_world_dbs
    WHERE fld_type = p_type AND fld_use = 1
    UNION 
    SELECT fld_name, fld_address, fld_port, fld_uid, fld_pwd, fld_database
    FROM setting_global_dbs
    WHERE fld_type = p_type AND fld_use = 1;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `ssp_select_dbs2` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `ssp_select_dbs2`(
	IN p_WorldID	INT -- 월드 번호
,	IN p_type		INT	-- SQL 타입
)
BEGIN
	SELECT fld_name, fld_address, fld_port, fld_uid, fld_pwd, fld_database
    FROM setting_world_dbs
    WHERE fld_world_idx = p_WorldID AND fld_type = p_type AND fld_use = 1
    UNION 
    SELECT fld_name, fld_address, fld_port, fld_uid, fld_pwd, fld_database
    FROM setting_global_dbs
    WHERE fld_type = p_type AND fld_use = 1;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `ssp_select_redis` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `ssp_select_redis`(
	IN p_type		INT	-- Redis 타입
)
BEGIN
	SELECT fld_address, fld_port 
    FROM setting_world_redis
    WHERE fld_type = p_type AND fld_use = 1;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `ssp_select_redis2` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `ssp_select_redis2`(
	IN p_WorldID	INT -- 월드 번호
,	IN p_type		INT	-- Redis 타입
)
BEGIN
	SELECT fld_address, fld_port 
    FROM setting_world_redis
    WHERE fld_world_idx = p_WorldID AND fld_type = p_type AND fld_use = 1;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `ssp_select_setting` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `ssp_select_setting`(
	IN p_type			INT 	-- 종류(1:로비, 2:필드, 3:레이드, 4:웹로비, 5:채팅, 11:로그인서버, 13:필드매니지)
,	IN p_server_key		INT		-- 서버 세션키
)
BEGIN

    /*******************************************
    / 변수 정의
    ********************************************/ 
	-- 로그인 서버 포트
    DECLARE v_login_address_pri_l4				VARCHAR(256) DEFAULT '';
	DECLARE	v_login_port_acceptor_game			INT DEFAULT 0;
    DECLARE	v_login_port_acceptor_lobby			INT DEFAULT 0;
    DECLARE	v_login_port_acceptor_field			INT DEFAULT 0;
    DECLARE	v_login_port_acceptor_raid			INT DEFAULT 0;
    DECLARE	v_login_port_acceptor_chat			INT DEFAULT 0;
    DECLARE	v_login_port_acceptor_weblobby		INT DEFAULT 0;
    DECLARE	v_login_port_acceptor_manage		INT DEFAULT 0;
    
    -- 로비 매니저 포트
    DECLARE v_lm_address_pri_l4					VARCHAR(256) DEFAULT '';
    DECLARE	v_lm_port_acceptor_lobby			INT DEFAULT 0;
    DECLARE	v_lm_port_acceptor_field			INT DEFAULT 0;
    DECLARE	v_lm_port_acceptor_raid				INT DEFAULT 0;
    DECLARE	v_lm_port_acceptor_weblobby			INT DEFAULT 0;
    
    -- 필드 매니저 포트
    DECLARE v_fm_address_pri_l4					VARCHAR(256) DEFAULT '';
    DECLARE	v_fm_port_acceptor_lobby			INT DEFAULT 0;
    DECLARE	v_fm_port_acceptor_field			INT DEFAULT 0;
    DECLARE	v_fm_port_acceptor_raid				INT DEFAULT 0;
    DECLARE	v_fm_port_acceptor_weblobby			INT DEFAULT 0;    
    
    -- 레이드 매니저 포트
    DECLARE v_rm_address_pri_l4					VARCHAR(256) DEFAULT '';
	DECLARE	v_rm_port_acceptor_lobby			INT DEFAULT 0;
    DECLARE	v_rm_port_acceptor_field			INT DEFAULT 0;
    DECLARE	v_rm_port_acceptor_raid				INT DEFAULT 0;
    DECLARE	v_rm_port_acceptor_weblobby			INT DEFAULT 0; 	
    

    -- 채팅 서버 포트
    DECLARE v_chat_address_pri_l4				VARCHAR(256) DEFAULT '';
    DECLARE	v_chat_port_acceptor_server_mmo		INT DEFAULT 0; 	
    DECLARE	v_chat_port_acceptor_server_pm		INT DEFAULT 0;	-- 파티 매니지 서버 접속 포트
    DECLARE v_chat_address_pub_l4				VARCHAR(256) DEFAULT '';
	DECLARE v_chat_address6_pub_l4				VARCHAR(256) DEFAULT '';
    DECLARE	v_chat_port_acceptor_user			INT DEFAULT 0;

    -- 파티 매니저 포트
    DECLARE v_pm_address_pri_l4					VARCHAR(256) DEFAULT '';
    DECLARE	v_pm_port_acceptor_servers			INT DEFAULT 0;
	
	-- 웹로비 서버 L4 Address(public)
    DECLARE v_weblobby_address_pub_l4			VARCHAR(256) DEFAULT '';	-- 웹로비 로컬 주소(유저들)
	DECLARE v_weblobby_address6_pub_l4			VARCHAR(256) DEFAULT '';	-- 웹로비 로컬 주소(유저들)
    DECLARE v_weblobby_port_acceptor_user		INT DEFAULT 0; 	    		-- 웹로비 접속 포트(유저들)
    DECLARE v_weblobby_address_pri_l4			VARCHAR(256) DEFAULT '';	-- 웹로비 로컬 주소(서버들)
    DECLARE v_weblobby_port_acceptor_game		INT DEFAULT 0;				-- 웹로비 접속 포트(서버들)
    
    -- 로그 리시버 서버 정보
    DECLARE v_gamelog_address					VARCHAR(256) DEFAULT '';	-- 로그 리시버 주소
    DECLARE v_gamelog_port						INT DEFAULT 0;				-- 로그 리시버 포트

	-- 월드 번호
    DECLARE v_world_idx 	INT DEFAULT 0;
    
        

    /*******************************************
    / 월드 번호 먼저 설정
    ********************************************/    
	IF p_type = 1 THEN	-- 로비 서버
    BEGIN    
		SELECT world_idx INTO v_world_idx FROM setting_world_lobby WHERE server_key = p_server_key;
    END;
    ELSEIF p_type = 2 THEN	-- 필드 서버
    BEGIN
		SELECT world_idx INTO v_world_idx FROM setting_world_field WHERE server_key = p_server_key;
    END;    
    ELSEIF p_type = 3 THEN	-- 레이드 서버
    BEGIN
		SELECT world_idx INTO v_world_idx FROM setting_world_raid WHERE server_key = p_server_key;
    END;
    ELSEIF p_type = 4 THEN	-- 웹로비
    BEGIN    
		SELECT world_idx INTO v_world_idx FROM setting_world_weblobby WHERE server_key = p_server_key;
	END;
    ELSEIF p_type = 5 THEN	-- 채팅
    BEGIN  
		SELECT world_idx INTO v_world_idx FROM setting_world_chat WHERE server_key = p_server_key;
    END;     
    ELSEIF p_type = 11 THEN	-- 로그인 서버
    BEGIN    
		SELECT world_idx INTO v_world_idx FROM setting_world_login WHERE server_key = p_server_key;
    END;
    ELSEIF p_type = 13 THEN	-- 필드 매니지
    BEGIN     
		SELECT world_idx INTO v_world_idx FROM setting_world_fieldmanage WHERE server_key = p_server_key;
    END;
    END IF;


    /*******************************************
    / (0) Acceptor 포트 정보 설정
    ********************************************/    
	-- 로그인 서버
	SELECT address_pri_l4, port_acceptor_game, port_acceptor_lobby, port_acceptor_field, port_acceptor_raid, port_acceptor_chat, port_acceptor_weblobby, port_acceptor_manage
    INTO v_login_address_pri_l4, v_login_port_acceptor_game, v_login_port_acceptor_lobby, v_login_port_acceptor_field, v_login_port_acceptor_raid, v_login_port_acceptor_chat, v_login_port_acceptor_weblobby, v_login_port_acceptor_manage
	FROM setting_world_login
    WHERE world_idx = v_world_idx;

	-- 로비 매니저 서버
	SELECT address_pri_l4, port_acceptor_lobby, port_acceptor_field, port_acceptor_raid, port_acceptor_weblobby
    INTO v_lm_address_pri_l4, v_lm_port_acceptor_lobby, v_lm_port_acceptor_field, v_lm_port_acceptor_raid, v_lm_port_acceptor_weblobby
	FROM setting_world_lobby
    WHERE world_idx = v_world_idx;
    
	-- 필드 매니저 서버
	SELECT address_pri_l4, port_acceptor_lobby, port_acceptor_field, port_acceptor_raid, port_acceptor_weblobby
    INTO v_fm_address_pri_l4, v_fm_port_acceptor_lobby, v_fm_port_acceptor_field, v_fm_port_acceptor_raid, v_fm_port_acceptor_weblobby
	FROM setting_world_fieldmanage
    WHERE world_idx = v_world_idx;
    
	-- 레이드 매니저 서버
	SELECT address_pri_l4, port_acceptor_lobby, port_acceptor_field, port_acceptor_raid, port_acceptor_weblobby
    INTO v_rm_address_pri_l4, v_rm_port_acceptor_lobby, v_rm_port_acceptor_field, v_rm_port_acceptor_raid, v_rm_port_acceptor_weblobby
	FROM setting_world_raid
    WHERE world_idx = v_world_idx;
	
	-- 파티 매니저 서버
	SELECT address_pri_acceptor_ip, port_acceptor_servers INTO v_pm_address_pri_l4, v_pm_port_acceptor_servers
	FROM setting_world_weblobby
    WHERE world_idx = v_world_idx;
    
	-- 채팅 서버
	SELECT address_pri_acceptor_ip, address_pub_acceptor_ip, address_pub_acceptor_ip6, port_acceptor_user, port_acceptor_server_mmo, port_acceptor_server_pm 
    INTO v_chat_address_pri_l4, v_chat_address_pub_l4, v_chat_address6_pub_l4, v_chat_port_acceptor_user, v_chat_port_acceptor_server_mmo, v_chat_port_acceptor_server_pm
	FROM setting_world_chat
    WHERE world_idx = v_world_idx;
    
    -- 웹로비 서버 L4 Address(public)
	SELECT address_pub_acceptor_ip, address_pub_acceptor_ip6, port_acceptor_user, address_pri_acceptor_ip, port_acceptor_game 
	INTO v_weblobby_address_pub_l4, v_weblobby_address6_pub_l4, v_weblobby_port_acceptor_user, v_weblobby_address_pri_l4, v_weblobby_port_acceptor_game
    FROM setting_world_weblobby
    WHERE world_idx = v_world_idx;
    
    -- 로그 리시버 서버
    SELECT address_acceptor_gamelog, port_acceptor_gamelog
    INTO v_gamelog_address, v_gamelog_port
	FROM setting_global_common_gate; 
    


    /*******************************************
    / (1) 로비 서버 관련 셋팅
    ********************************************/    
	IF p_type = 1 THEN
    BEGIN    
		-- 로비 서버의 셋팅을 읽어온다.
		SELECT	a.address_pub_acceptor_ip, a.address_pub_acceptor_ip6, a.port_acceptor_user,
                c.country, c.world_idx, c.world_name,
                v_gamelog_address as address_gamelog, v_gamelog_port as port_gamelog,
				v_login_address_pri_l4 as address_pri_login, v_login_port_acceptor_lobby as port_login,
				v_chat_address_pri_l4 as address_pri_chat, v_chat_port_acceptor_server_mmo as port_chat,
				v_lm_address_pri_l4 as address_pri_LM, v_lm_port_acceptor_lobby as port_LM,
				v_fm_address_pri_l4 as address_pri_FM, v_fm_port_acceptor_lobby as port_FM,
				v_rm_address_pri_l4 as address_pri_RM, v_rm_port_acceptor_lobby as port_RM,
				v_pm_address_pri_l4 as address_pri_PM, v_pm_port_acceptor_servers as port_PM,
                v_weblobby_address_pub_l4, v_weblobby_address6_pub_l4, v_weblobby_port_acceptor_user,
                v_weblobby_address_pri_l4, v_weblobby_port_acceptor_game
		FROM setting_world_lobby as a, setting_world_common as c
        WHERE c.world_idx = v_world_idx AND a.server_key = p_server_key;
        
        -- common_url
        SELECT platform_type, url_type, url_sub_type, url_string
        FROM setting_global_common_url;
        
        -- common_platform
        SELECT platform_type, url_type, param_int_1, param_int_2, param_int_3, param_str_1, param_str_2, param_str_3, param_str_4, param_str_5
        FROM setting_global_common_platform;        
    END;
    
    /*******************************************
    / (2) 필드 서버 관련 셋팅
    ********************************************/    
    ELSEIF p_type = 2 THEN
    BEGIN
		-- 필드서버의 셋팅을 읽어온다.
		SELECT	address_pub_acceptor_ip, address_pub_acceptor_ip6, port_acceptor_user,
                c.country, c.world_idx, c.world_name, c.use_admin_cmd,
                v_gamelog_address as address_gamelog, v_gamelog_port as port_gamelog,
				v_login_address_pri_l4 as address_pri_login, v_login_port_acceptor_lobby as port_login,
				v_chat_address_pri_l4 as address_pri_chat, v_chat_port_acceptor_server_mmo as port_chat,
				v_lm_address_pri_l4 as address_pri_LM, v_lm_port_acceptor_field as port_LM,
				v_fm_address_pri_l4 as address_pri_FM, v_fm_port_acceptor_field as port_FM,
				v_rm_address_pri_l4 as address_pri_RM, v_rm_port_acceptor_field as port_RM,
				v_pm_address_pri_l4 as address_pri_PM, v_pm_port_acceptor_servers as port_PM,
                v_weblobby_address_pub_l4, v_weblobby_address6_pub_l4, v_weblobby_port_acceptor_user,
                v_weblobby_address_pri_l4, v_weblobby_port_acceptor_game
		FROM setting_world_field as a, setting_world_common as c
		WHERE c.world_idx = v_world_idx AND a.server_key = p_server_key;
        
        -- common_url
        SELECT platform_type, url_type, url_sub_type, url_string
        FROM setting_global_common_url;
        
        -- common_platform
        SELECT platform_type, url_type, param_int_1, param_int_2, param_int_3, param_str_1, param_str_2, param_str_3, param_str_4, param_str_5
        FROM setting_global_common_platform;        
    END;    

    /*******************************************
    / (3) 레이드 서버 관련 셋팅
    ********************************************/
    ELSEIF p_type = 3 THEN
    BEGIN
		-- 레이드 서버의 셋팅을 읽어온다.
		SELECT	address_pub_acceptor_ip, address_pub_acceptor_ip6, port_acceptor_user,
                c.country, c.world_idx, c.world_name, c.use_admin_cmd,
                v_gamelog_address as address_gamelog, v_gamelog_port as port_gamelog,
				v_login_address_pri_l4 as address_pri_login, v_login_port_acceptor_lobby as port_login,
				v_chat_address_pri_l4 as address_pri_chat, v_chat_port_acceptor_server_mmo as port_chat,
				v_lm_address_pri_l4 as address_pri_LM, v_lm_port_acceptor_raid as port_LM,
				v_fm_address_pri_l4 as address_pri_FM, v_fm_port_acceptor_raid as port_FM,
				v_rm_address_pri_l4 as address_pri_RM, v_rm_port_acceptor_raid as port_RM,
				v_pm_address_pri_l4 as address_pri_PM, v_pm_port_acceptor_servers as port_PM,              
                v_weblobby_address_pub_l4, v_weblobby_address6_pub_l4, v_weblobby_port_acceptor_user,
                v_weblobby_address_pri_l4, v_weblobby_port_acceptor_game
		FROM setting_world_raid as a, setting_world_common as c
        WHERE c.world_idx = v_world_idx AND a.server_key = p_server_key;
        
        -- common_url
        SELECT platform_type, url_type, url_sub_type, url_string
        FROM setting_global_common_url;
        
        -- common_platform
        SELECT platform_type, url_type, param_int_1, param_int_2, param_int_3, param_str_1, param_str_2, param_str_3, param_str_4, param_str_5
        FROM setting_global_common_platform;        
    END;
    
    /*******************************************
    / (4) 웹로비 서버 관련 셋팅
    ********************************************/       
    ELSEIF p_type = 4 THEN
    BEGIN    
 		-- 웹로비 서버의 셋팅을 읽어온다.
		SELECT	port_acceptor_user,
                address_pub_acceptor_ip, address_pub_acceptor_ip6, address_pri_acceptor_ip,
                c.country, c.world_idx, c.world_name,
                v_gamelog_address as address_gamelog, v_gamelog_port as port_gamelog,
				v_login_address_pri_l4 as address_pri_login, v_login_port_acceptor_lobby as port_login,
				v_chat_address_pri_l4 as address_pri_chat, v_chat_port_acceptor_server_mmo as port_chat,
				v_lm_address_pri_l4 as address_pri_LM, v_lm_port_acceptor_weblobby as port_LM,
				v_fm_address_pri_l4 as address_pri_FM, v_fm_port_acceptor_weblobby as port_FM,
                v_rm_address_pri_l4 as address_pri_RM, v_rm_port_acceptor_lobby as port_RM,
				v_pm_address_pri_l4 as address_pri_PM, v_pm_port_acceptor_servers as port_PM,  
                v_weblobby_address_pub_l4, v_weblobby_address6_pub_l4, v_weblobby_port_acceptor_user,
                v_weblobby_address_pri_l4, v_weblobby_port_acceptor_game
		FROM setting_world_weblobby as a, setting_world_common as c
		WHERE c.world_idx = v_world_idx AND a.server_key = p_server_key;
        
        -- common_url
        SELECT platform_type, url_type, url_sub_type, url_string
        FROM setting_global_common_url;
        
        -- common_platform
        SELECT platform_type, url_type, param_int_1, param_int_2, param_int_3, param_str_1, param_str_2, param_str_3, param_str_4, param_str_5
        FROM setting_global_common_platform;        
	END;
	
    /*******************************************
    / (5) 채팅 서버 관련 셋팅 
    ********************************************/
    ELSEIF p_type = 5 THEN
    BEGIN  
		-- 채팅 서버의 셋팅을 읽어온다.
		SELECT	v_login_port_acceptor_chat as port_login, 
				port_acceptor_user,
                port_acceptor_server_mmo,
                port_acceptor_server_pm,
                port_acceptor_server_admin,
                address_pri_acceptor_ip, address_pub_acceptor_ip, address_pub_acceptor_ip6,
                c.country, c.world_idx, c.world_name, v_login_address_pri_l4 as address_pri_login,
                v_gamelog_address as address_gamelog, v_gamelog_port as port_gamelog,
                v_weblobby_address_pub_l4, v_weblobby_address6_pub_l4, v_weblobby_port_acceptor_user,
                v_weblobby_address_pri_l4, v_weblobby_port_acceptor_game
		FROM setting_world_chat as a, setting_world_common as c
		WHERE c.world_idx = v_world_idx AND a.server_key = p_server_key;
    END;     
    

    
    
    /*******************************************
    / (11) 로그인 서버 관련 셋팅 
    ********************************************/    
    ELSEIF p_type = 11 THEN
    BEGIN    
		-- 로그인 서버의 셋팅을 읽어온다.
		SELECT	port_acceptor_game,	port_acceptor_lobby, port_acceptor_field,
				port_acceptor_raid,	port_acceptor_chat,	port_acceptor_weblobby,	port_acceptor_manage,
                address_pri_l4 as address_pri_acceptor_ip,
                c.country, c.world_idx, c.world_type, c.world_name, c.world_event_tab, c.world_max_user_count, c.world_idx as server_group, c.world_client_version,
                v_gamelog_address as address_gamelog, v_gamelog_port as port_gamelog,
                v_weblobby_address_pub_l4, v_weblobby_address6_pub_l4, v_weblobby_port_acceptor_user,
                v_weblobby_address_pri_l4, v_weblobby_port_acceptor_game,
                v_chat_address_pub_l4, v_chat_address6_pub_l4, v_chat_port_acceptor_user
		FROM setting_world_login as a, setting_world_common as c
		WHERE c.world_idx = v_world_idx AND a.server_key = p_server_key;
        
        -- 서브 월드 정보를 읽어온다.
        SELECT sub_world_idx, sub_world_name, sub_world_event_tab
        FROM setting_world_common_subworld
		WHERE world_idx = v_world_idx;        
    END;

    /*******************************************
    / (13) 필드 매니지 서버 관련 셋팅 
    ********************************************/    
    ELSEIF p_type = 13 THEN
    BEGIN     
		-- 필드 매니지 서버의 셋팅을 읽어온다.
		SELECT	v_login_port_acceptor_manage as port_login, 
				port_acceptor_lobby, port_acceptor_field, port_acceptor_raid, port_acceptor_weblobby,
                address_pri_l4 as address_pri_acceptor_ip,
                c.country, c.world_idx, v_login_address_pri_l4 as address_pri_login,
                v_gamelog_address as address_gamelog, v_gamelog_port as port_gamelog,
                v_weblobby_address_pub_l4, v_weblobby_address6_pub_l4, v_weblobby_port_acceptor_user,
                v_weblobby_address_pri_l4, v_weblobby_port_acceptor_game
		FROM setting_world_fieldmanage as a, setting_world_common as c
		WHERE c.world_idx = v_world_idx AND a.server_key = p_server_key;
    END;  
        
    END IF;
    
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
