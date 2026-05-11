-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Maj 11, 2026 at 09:18 PM
-- Wersja serwera: 10.4.32-MariaDB
-- Wersja PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `project`
--

DELIMITER $$
--
-- Procedury
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_add_user` (IN `p_email` VARCHAR(255), IN `p_password` VARCHAR(255), IN `p_name` VARCHAR(255), IN `p_last_name` VARCHAR(255), IN `p_lang` VARCHAR(32))   BEGIN
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
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_access_tools` (IN `p_id_users` INT)   SELECT * FROM (
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
ORDER BY `status` DESC, `id` ASC$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_login_user` (IN `p_email` VARCHAR(255), IN `p_password` VARCHAR(255))   BEGIN
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
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `access_tables`
--

CREATE TABLE `access_tables` (
  `id` int(11) NOT NULL,
  `id_users` int(11) NOT NULL COMMENT 'User ID',
  `tables` text NOT NULL COMMENT 'Table name',
  `access_table` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Has access to table',
  `add_record` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Can add records',
  `read_record` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Can read records',
  `update_record` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Can update records',
  `delete_record` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Can delete records',
  `created_at` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'Created at',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Updated at'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `access_tools`
--

CREATE TABLE `access_tools` (
  `id` int(11) NOT NULL,
  `id_users` int(11) NOT NULL COMMENT 'User ID',
  `tools_name` text NOT NULL COMMENT 'Module name',
  `access_tools` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Has access to module',
  `read_tools` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Can read records',
  `add_tools` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Can add records',
  `delete_tools` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Can delete records',
  `update_tools` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Can update records',
  `created_at` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'Created at',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Updated at'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `access_tools`
--

INSERT INTO `access_tools` (`id`, `id_users`, `tools_name`, `access_tools`, `read_tools`, `add_tools`, `delete_tools`, `update_tools`, `created_at`, `updated_at`) VALUES
(3, 1, 'admin_company', 1, 0, 0, 0, 0, '2026-05-11 16:18:19', '2026-05-11 14:18:19'),
(4, 1, 'admin_system', 1, 0, 0, 0, 0, '2026-05-11 20:16:15', '2026-05-11 19:13:59');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `company`
--

CREATE TABLE `company` (
  `id` int(11) NOT NULL COMMENT 'Company unique ID',
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
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Updated at'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Company data table';

--
-- Dumping data for table `company`
--

INSERT INTO `company` (`id`, `name`, `type`, `active`, `tax_id`, `regon`, `krs`, `address`, `city`, `postal_code`, `country`, `phone`, `email`, `website`, `created_at`, `updated_at`) VALUES
(1, 'administraca systemu', '', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-18 07:45:03', '2026-04-18 05:45:03'),
(2, 'firma testowa', 'dla testu', 1, NULL, NULL, NULL, 'przykladowy adres', 'warszawa', NULL, 'Polska', NULL, 'email@email.pl', 'www.test.pl', '2026-04-21 07:34:42', '2026-04-21 05:38:08');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `company_users`
--

CREATE TABLE `company_users` (
  `id` int(11) NOT NULL,
  `id_company` int(11) NOT NULL COMMENT 'Company ID',
  `id_users` int(11) NOT NULL COMMENT 'User ID',
  `active` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Is active',
  `created_at` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'Created at',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Updated at'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `role` enum('admin system','admin company','user','guest') NOT NULL DEFAULT 'guest' COMMENT 'User role',
  `name` text NOT NULL COMMENT 'First name',
  `last_name` text NOT NULL COMMENT 'Last name',
  `login` text DEFAULT NULL COMMENT 'Login',
  `email` text NOT NULL COMMENT 'Email',
  `password` text NOT NULL COMMENT 'Password',
  `active` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Is active',
  `created_at` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'Created at',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Updated at',
  `lang` enum('Polski','English','Svenska') NOT NULL DEFAULT 'Polski' COMMENT 'jezyk systemu'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `role`, `name`, `last_name`, `login`, `email`, `password`, `active`, `created_at`, `updated_at`, `lang`) VALUES
(1, 'user', 'stasiuk', 'artur', NULL, 'nowy@pracownik.pl', '6b13b9fdeda16b9743ee511faafcdeaba96412b02ca8aab90cee81a87d21c3ed', 1, '2026-05-11 07:00:40', '2026-05-11 14:16:47', 'Polski');

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `access_tables`
--
ALTER TABLE `access_tables`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_access_tables_users` (`id_users`);

--
-- Indeksy dla tabeli `access_tools`
--
ALTER TABLE `access_tools`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_access_modules_users` (`id_users`);

--
-- Indeksy dla tabeli `company`
--
ALTER TABLE `company`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `company_users`
--
ALTER TABLE `company_users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_company` (`id_company`),
  ADD KEY `idx_users` (`id_users`);

--
-- Indeksy dla tabeli `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`) USING HASH;

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `access_tables`
--
ALTER TABLE `access_tables`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `access_tools`
--
ALTER TABLE `access_tools`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `company`
--
ALTER TABLE `company`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Company unique ID', AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `company_users`
--
ALTER TABLE `company_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `access_tables`
--
ALTER TABLE `access_tables`
  ADD CONSTRAINT `fk_access_tables_users` FOREIGN KEY (`id_users`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `access_tools`
--
ALTER TABLE `access_tools`
  ADD CONSTRAINT `fk_access_modules_users` FOREIGN KEY (`id_users`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `company_users`
--
ALTER TABLE `company_users`
  ADD CONSTRAINT `fk_company_users_company` FOREIGN KEY (`id_company`) REFERENCES `company` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_company_users_users` FOREIGN KEY (`id_users`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;