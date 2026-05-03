-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Maj 03, 2026 at 08:19 PM
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

--
-- Dumping data for table `access_tables`
--

INSERT INTO `access_tables` (`id`, `id_users`, `tables`, `access_table`, `add_record`, `read_record`, `update_record`, `delete_record`, `created_at`, `updated_at`) VALUES
(1, 1, 'company', 1, 1, 1, 1, 1, '2026-04-17 12:36:34', '2026-04-28 04:17:25'),
(2, 1, 'users', 1, 1, 1, 1, 0, '2026-04-21 21:57:58', '2026-05-02 15:21:24');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `access_tools`
--

CREATE TABLE `access_tools` (
  `id` int(11) NOT NULL,
  `id_users` int(11) NOT NULL COMMENT 'User ID',
  `tools_name` text NOT NULL COMMENT 'Module name',
  `access_tools` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Has access to module',
  `read_record` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Can read records',
  `add_record` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Can add records',
  `delete_record` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Can delete records',
  `update_record` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Can update records',
  `created_at` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'Created at',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Updated at'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `access_tools`
--

INSERT INTO `access_tools` (`id`, `id_users`, `tools_name`, `access_tools`, `read_record`, `add_record`, `delete_record`, `update_record`, `created_at`, `updated_at`) VALUES
(2, 1, 'admin_company', 0, 0, 0, 0, 0, '2026-04-15 15:16:20', '2026-04-16 06:20:24'),
(3, 1, 'users', 1, 0, 0, 0, 0, '2026-04-29 16:42:49', '2026-05-02 14:23:51'),
(4, 1, 'admin_system', 1, 1, 1, 1, 1, '2026-05-02 12:19:40', '2026-05-02 10:20:48');

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
(7, 'administraca systemu', 'admin', 1, '', '', '', '', '', '', 'Polska', '', 'arturstasiuk153@gmail.com', '', '2026-04-29 05:21:44', '2026-05-02 14:46:32'),
(8, 'prubna firma', 'dok', 1, '', '', '', '', '', '', '', '', '', '', '2026-05-01 09:32:43', '2026-05-01 07:32:43');

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

--
-- Dumping data for table `company_users`
--

INSERT INTO `company_users` (`id`, `id_company`, `id_users`, `active`, `created_at`, `updated_at`) VALUES
(2, 7, 1, 1, '2026-05-01 20:05:56', '2026-05-02 09:58:52'),
(3, 7, 2, 1, '2026-05-02 11:18:27', '2026-05-02 09:58:54');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `role` enum('admin system','admin company','admin','user','guest') NOT NULL DEFAULT 'guest' COMMENT 'User role',
  `name` text DEFAULT NULL COMMENT 'First name',
  `last_name` text DEFAULT NULL COMMENT 'Last name',
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
(1, 'admin system', 'Admin', 'Admin', NULL, 'admin@admin.pl', '$2y$10$hPX6k2BcClpLtfKvxaSyPuQt4JgHaLMt30vdobA5Czjc6aKImB5By', 1, '2026-04-12 22:27:07', '2026-05-02 10:00:13', 'Polski'),
(2, 'guest', 'uzytkownik', 'testowy', 'Login_Uzytkownika', 'uzytkownik@testowy.pl', 'nuul', 1, '2026-05-02 11:17:59', '2026-05-02 10:00:19', 'Svenska');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Company unique ID', AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `company_users`
--
ALTER TABLE `company_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
