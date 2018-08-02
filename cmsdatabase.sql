-- phpMyAdmin SQL Dump
-- version 4.7.9
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Aug 02, 2018 at 11:40 PM
-- Server version: 5.7.21
-- PHP Version: 5.6.35

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cmsdatabase`
--

-- --------------------------------------------------------

--
-- Table structure for table `main_pages`
--

DROP TABLE IF EXISTS `main_pages`;
CREATE TABLE IF NOT EXISTS `main_pages` (
  `mainpage_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `content` text NOT NULL,
  `can_delete` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`name`),
  UNIQUE KEY `main_page_index` (`mainpage_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `main_pages`
--

INSERT INTO `main_pages` (`mainpage_id`, `name`, `content`, `can_delete`) VALUES
(2, 'About', '<p>This is the about page</p>', b'0'),
(3, 'Contact', '<p>This is our contact page</p>', b'0'),
(1, 'Home', '<p>This is our home page</p>\r\n\r\n<p>With a second paragraph</p>', b'0');

-- --------------------------------------------------------

--
-- Table structure for table `sub_pages`
--

DROP TABLE IF EXISTS `sub_pages`;
CREATE TABLE IF NOT EXISTS `sub_pages` (
  `page_id` int(11) NOT NULL AUTO_INCREMENT,
  `main_page_name` varchar(32) NOT NULL,
  `name` varchar(32) NOT NULL,
  `content` text NOT NULL,
  `can_delete` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`page_id`),
  KEY `main_page_index` (`main_page_name`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `sub_pages`
--

INSERT INTO `sub_pages` (`page_id`, `main_page_name`, `name`, `content`, `can_delete`) VALUES
(1, 'About', 'History', '<p>This is the history page</p>', b'0'),
(3, 'About', 'Mission', '<p>Mission page</p>', b'0'),
(4, 'Contact', 'Location', '<p>Location page</p>', b'0'),
(5, 'Contact', 'Email', '<p>Email page</p>', b'0');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `sub_pages`
--
ALTER TABLE `sub_pages`
  ADD CONSTRAINT `main_page_fk` FOREIGN KEY (`main_page_name`) REFERENCES `main_pages` (`name`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
