-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: project
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `project`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `project` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `project`;

--
-- Table structure for table `access_tables`
--

DROP TABLE IF EXISTS `access_tables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `access_tables` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_users` int(11) NOT NULL COMMENT 'User ID',
  `tables` text NOT NULL COMMENT 'Table name',
  `access_table` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Has access to table',
  `add_record` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Can add records',
  `read_record` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Can read records',
  `update_record` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Can update records',
  `delete_record` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Can delete records',
  `created_at` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'Created at',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Updated at',
  PRIMARY KEY (`id`),
  KEY `idx_access_tables_users` (`id_users`),
  CONSTRAINT `fk_access_tables_users` FOREIGN KEY (`id_users`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `access_tools`
--

DROP TABLE IF EXISTS `access_tools`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `access_tools` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_users` int(11) NOT NULL COMMENT 'User ID',
  `tools_name` text NOT NULL COMMENT 'Module name',
  `access_tools` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Has access to module',
  `read_tools` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Can read records',
  `add_tools` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Can add records',
  `delete_tools` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Can delete records',
  `update_tools` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Can update records',
  `created_at` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'Created at',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Updated at',
  PRIMARY KEY (`id`),
  KEY `idx_access_modules_users` (`id_users`),
  CONSTRAINT `fk_access_modules_users` FOREIGN KEY (`id_users`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `company`
--

DROP TABLE IF EXISTS `company`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `company` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Company unique ID',
  `name` varchar(255) NOT NULL COMMENT 'Company name',
  `type` varchar(100) NOT NULL COMMENT 'Company type',
  `active` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Is active',
  `tax_id` varchar(50) DEFAULT NULL COMMENT 'NIP',
  `regon` varchar(50) DEFAULT NULL COMMENT 'REGON',
  `krs` varchar(50) DEFAULT NULL COMMENT 'KRS',
  `address` varchar(255) DEFAULT NULL COMMENT 'Address',
  `city` varchar(100) DEFAULT NULL COMMENT 'City',
  `postal_code` varchar(20) DEFAULT NULL COMMENT 'Postal code',
  `country` varchar(100) DEFAULT NULL COMMENT 'Country',
  `phone` varchar(50) DEFAULT NULL COMMENT 'Phone',
  `email` varchar(100) DEFAULT NULL COMMENT 'Email',
  `website` varchar(100) DEFAULT NULL COMMENT 'Website',
  `created_at` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'Created at',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Updated at',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Company data table';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `company_users`
--

DROP TABLE IF EXISTS `company_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `company_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_company` int(11) NOT NULL COMMENT 'Company ID',
  `id_users` int(11) NOT NULL COMMENT 'User ID',
  `active` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Is active',
  `created_at` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'Created at',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Updated at',
  PRIMARY KEY (`id`),
  KEY `idx_company` (`id_company`),
  KEY `idx_users` (`id_users`),
  CONSTRAINT `fk_company_users_company` FOREIGN KEY (`id_company`) REFERENCES `company` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_company_users_users` FOREIGN KEY (`id_users`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role` enum('admin system','admin company','user','guest') NOT NULL DEFAULT 'guest' COMMENT 'User role',
  `name` text NOT NULL COMMENT 'First name',
  `last_name` text NOT NULL COMMENT 'Last name',
  `login` text DEFAULT NULL COMMENT 'Login',
  `email` text NOT NULL COMMENT 'Email',
  `password` text NOT NULL COMMENT 'Password',
  `active` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Is active',
  `created_at` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'Created at',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Updated at',
  `lang` enum('Polski','English','Svenska') NOT NULL DEFAULT 'Polski' COMMENT 'jezyk systemu',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`) USING HASH
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping events for database 'project'
--

--
-- Dumping routines for database 'project'
--
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_add_user` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_add_user`(IN `p_email` VARCHAR(255), IN `p_password` VARCHAR(255), IN `p_name` VARCHAR(255), IN `p_last_name` VARCHAR(255), IN `p_lang` VARCHAR(32))
BEGIN
    DECLARE v_exists INT DEFAULT 0;
    DECLARE v_new_id BIGINT UNSIGNED DEFAULT NULL;
    DECLARE v_role ENUM('admin system', 'admin company', 'user', 'guest') DEFAULT 'user';
    -- 1) Walidacja email (wzorzec bez problematycznego escapowania kropki w stringu SQL)
    IF p_email IS NULL
       OR TRIM(p_email) = ''
       OR TRIM(p_email) NOT REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+[.][A-Za-z]{2,}$' THEN
        SELECT
            0 AS `status`,
            0 AS `success`,
            'NIEPOPRAWNY_EMAIL' AS `message`;
    ELSE
        -- 2) Sprawdzenie czy email juz istnieje (ten sam format co przy INSERT)
        SELECT COUNT(*) INTO v_exists
        FROM users
        WHERE email = TRIM(p_email);
        IF v_exists > 0 THEN
            SELECT
                0 AS `status`,
                0 AS `success`,
                'UZYTKOWNIK_JUZ_ISTNIEJE' AS `message`;
        -- 3) Walidacja hasla (min 8 znakow)
        ELSEIF p_password IS NULL OR CHAR_LENGTH(p_password) < 8 THEN
            SELECT
                0 AS `status`,
                0 AS `success`,
                'HASLO_MUSI_MIEC_CONAJMNIEJ_8_ZNAKOW' AS `message`;
        -- 4) Walidacja jezyka (wartosci musza pasowac do ENUM kolumny lang)
        ELSEIF p_lang IS NULL
              OR TRIM(p_lang) = ''
              OR TRIM(p_lang) NOT IN ('Polski', 'English', 'Svenska') THEN
            SELECT
                0 AS `status`,
                0 AS `success`,
                'NIEPOPRAWNY_JEZYK' AS `message`;
        -- 5) Dodanie uzytkownika
        ELSE
            INSERT INTO users (
                email,
                password,
                role,
                name,
                last_name,
                lang,
                active
            ) VALUES (
                TRIM(p_email),
                SHA2(p_password, 256),
                v_role,
                p_name,
                p_last_name,
                TRIM(p_lang),
                1
            );
            SET v_new_id = LAST_INSERT_ID();
            SELECT
                1 AS `status`,
                1 AS `success`,
                'DODANO_UZYTKOWNIKA' AS `message`,
                u.id,
                u.email,
                u.role,
                u.name,
                u.last_name,
                u.lang,
                u.active
            FROM users u
            WHERE u.id = v_new_id
            LIMIT 1;
        END IF;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_get_access_tables` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_access_tables`(IN `p_id_users` INT)
SELECT * FROM (
  SELECT
    1 AS `status`,
    'get tables' AS `message`,
    `id`,
    `id_users`,
    `tables`,
    `access_table`,
    `read_record`,
    `add_record`,
    `update_record`,
    `delete_record`
  FROM `access_tables`
  WHERE `id_users` = `p_id_users`
  UNION ALL
  SELECT
    0 AS `status`,
    'no tables' AS `message`,
    NULL AS `id`,
    NULL AS `id_users`,
    NULL AS `tables`,
    NULL AS `access_table`,
    NULL AS `read_record`,
    NULL AS `add_record`,
    NULL AS `update_record`,
    NULL AS `delete_record`
  FROM DUAL
  WHERE NOT EXISTS (
    SELECT 1 FROM `access_tables` WHERE `id_users` = `p_id_users` LIMIT 1
  )
) AS `t`
ORDER BY `status` DESC, `id` ASC ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_get_access_tools` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_access_tools`(IN `p_id_users` INT)
SELECT * FROM (
  SELECT
    1 AS `status`,
    'get tools' AS `message`,
    `id`,
    `id_users`,
    `tools_name`,
    `access_tools`,
    `read_tools`,
    `add_tools`,
    `delete_tools`,
    `update_tools`
  FROM `access_tools`
  WHERE `id_users` = `p_id_users`
  UNION ALL
  SELECT
    0 AS `status`,
    'no tools' AS `message`,
    NULL AS `id`,
    NULL AS `id_users`,
    NULL AS `tools_name`,
    NULL AS `access_tools`,
    NULL AS `read_tools`,
    NULL AS `add_tools`,
    NULL AS `delete_tools`,
    NULL AS `update_tools`
  FROM DUAL
  WHERE NOT EXISTS (
    SELECT 1 FROM `access_tools` WHERE `id_users` = `p_id_users` LIMIT 1
  )
) AS `t`
ORDER BY `status` DESC, `id` ASC ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_login_user` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_login_user`(IN `p_email` VARCHAR(255), IN `p_password` VARCHAR(255))
BEGIN
    DECLARE v_hash CHAR(64) DEFAULT NULL;
    DECLARE v_id INT DEFAULT NULL;
    DECLARE v_active TINYINT(1) DEFAULT NULL;
    -- 1) Walidacja email
    IF p_email IS NULL
       OR TRIM(p_email) = ''
       OR TRIM(p_email) NOT REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+[.][A-Za-z]{2,}$' THEN
        SELECT
            0 AS `status`,
            0 AS `success`,
            'NIEPOPRAWNY_EMAIL' AS `message`;
    -- 2) Haslo (plain przed SHA2; porownanie z zapisem SHA2(..., 256))
    ELSEIF p_password IS NULL OR CHAR_LENGTH(p_password) = 0 THEN
        SELECT
            0 AS `status`,
            0 AS `success`,
            'HASLO_WYMAGANE' AS `message`;
    ELSE
        SET v_hash = SHA2(p_password, 256);
        SELECT u.id, u.active INTO v_id, v_active
        FROM users u
        WHERE u.email = TRIM(p_email)
          AND u.password = v_hash
        LIMIT 1;
        IF v_id IS NULL THEN
            SELECT
                0 AS `status`,
                0 AS `success`,
                'BLEDNE_DANE_LOGOWANIA' AS `message`;
        ELSEIF v_active <> 1 THEN
            SELECT
                0 AS `status`,
                0 AS `success`,
                'KONTO_NIEAKTYWNE' AS `message`;
        ELSE
            SELECT
                1 AS `status`,
                1 AS `success`,
                'LOG_IN' AS `message`,
                u.id,
                u.role,
                u.name,
                u.last_name,
                u.login,
                u.email,
                u.active,
                u.created_at,
                u.updated_at,
                u.lang
            FROM users u
            WHERE u.id = v_id
            LIMIT 1;
        END IF;
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

-- Dump completed on 2026-05-12 22:24:03
