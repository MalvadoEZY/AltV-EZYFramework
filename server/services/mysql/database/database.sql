-- --------------------------------------------------------
-- Anfitrião:                    127.0.0.1
-- Versão do servidor:           10.4.14-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Versão:              11.0.0.5919
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for ocidental1592020_db
CREATE DATABASE IF NOT EXISTS `ocidental1592020_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `ocidental1592020_db`;

-- Dumping structure for table ocidental1592020_db.ban_list
CREATE TABLE IF NOT EXISTS `ban_list` (
  `id` int(11) NOT NULL,
  `socialID` varchar(100) DEFAULT NULL,
  `hwlicense` varchar(100) DEFAULT NULL,
  `hwlicenseEx` varchar(100) DEFAULT NULL,
  `discordID` varchar(50) DEFAULT NULL,
  `ipAddress` varchar(100) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `reason` varchar(500) DEFAULT NULL,
  `bannedBy` varchar(500) DEFAULT NULL,
  `time` varchar(500) DEFAULT NULL,
  `banDate` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='User ban list';

-- Data exporting was unselected.

-- Dumping structure for table ocidental1592020_db.characters
CREATE TABLE IF NOT EXISTS `characters` (
  `charID` int(11) NOT NULL AUTO_INCREMENT,
  `ownerID` varchar(50) NOT NULL,
  `position` varchar(500) DEFAULT NULL,
  `charInfo` varchar(1500) DEFAULT NULL,
  `appearance` varchar(1500) DEFAULT NULL,
  `clothes` varchar(1500) DEFAULT NULL,
  `tattoo` varchar(1500) DEFAULT NULL,
  `status` varchar(500) DEFAULT NULL,
  `health` int(200) DEFAULT NULL,
  PRIMARY KEY (`charID`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COMMENT='List of characters';

-- Data exporting was unselected.

-- Dumping structure for table ocidental1592020_db.inventory
CREATE TABLE IF NOT EXISTS `inventory` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ownerID` varchar(100) DEFAULT NULL,
  `inventory` varchar(4000) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table ocidental1592020_db.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `socialID` varchar(50) NOT NULL,
  `hwlicense` varchar(100) NOT NULL,
  `hwlicenseEx` varchar(100) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `discordID` varchar(50) DEFAULT NULL,
  `discordInfo` varchar(500) DEFAULT NULL,
  `permission` tinyint(100) DEFAULT NULL,
  `registedIP` varchar(50) DEFAULT NULL,
  `verified` tinyint(3) DEFAULT NULL,
  `registedDate` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COMMENT='List of users';

-- Data exporting was unselected.

-- Dumping structure for table ocidental1592020_db.vehicles
CREATE TABLE IF NOT EXISTS `vehicles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ownerID` int(11) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `status` varchar(2500) DEFAULT NULL,
  `info` varchar(2500) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='List of persistent vehicles\r\n';

-- Data exporting was unselected.

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
