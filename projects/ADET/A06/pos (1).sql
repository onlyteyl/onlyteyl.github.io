-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 18, 2025 at 04:14 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pos`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `categoryID` int(5) NOT NULL,
  `name` varchar(50) NOT NULL,
  `img` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`categoryID`, `name`, `img`) VALUES
(1, 'Coffee', 'img-category/coffee.png'),
(2, 'Tea', 'img-category/tea.png'),
(3, 'Food', 'img-category/food.png'),
(4, 'Dessert', 'img-category/dessert.png');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `productID` int(5) NOT NULL,
  `categoryID` int(5) NOT NULL,
  `name` varchar(100) NOT NULL,
  `isAvailable` varchar(8) NOT NULL DEFAULT 'true',
  `code` varchar(20) NOT NULL,
  `img` varchar(100) NOT NULL,
  `price` int(8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`productID`, `categoryID`, `name`, `isAvailable`, `code`, `img`, `price`) VALUES
(41, 1, 'Espresso', '1', 'ESP', 'img-menu/espresso.png', 120),
(42, 1, 'Americano', '1', 'AMR', 'img-menu/americano.png', 120),
(43, 1, 'Latte', '1', 'LTT', 'img-menu/latte.png', 120),
(44, 1, 'Cappuccino', '1', 'CPP', 'img-menu/cappuccino.png', 120),
(45, 1, 'Mocha', '1', 'MCH', 'img-menu/mocha.png', 120),
(46, 1, 'Caramel Macchiato', '1', 'CRM', 'img-menu/caramel_macchiato.png', 120),
(47, 1, 'Cold Brew', '1', 'CLD', 'img-menu/cold_brew.png', 120),
(48, 1, 'Iced Coffee', '1', 'ICF', 'img-menu/iced_coffee.png', 120),
(49, 1, 'Flat White', '1', 'FLW', 'img-menu/flat_white.png', 120),
(50, 1, 'Affogato', '1', 'AFF', 'img-menu/affogato.png', 120),
(51, 2, 'Green Tea', '1', 'GRN', 'img-menu/green_tea.png', 100),
(52, 2, 'Black Tea', '1', 'BLK', 'img-menu/black_tea.png', 100),
(53, 2, 'Milk Tea', '1', 'MLK', 'img-menu/milk_tea.png', 100),
(54, 2, 'Thai Tea', '1', 'THI', 'img-menu/thai_tea.png', 100),
(55, 2, 'Matcha Latte', '1', 'MCH', 'img-menu/matcha_latte.png', 100),
(56, 2, 'Earl Grey', '1', 'EGL', 'img-menu/earl_grey.png', 100),
(57, 2, 'Chai Tea', '1', 'CHI', 'img-menu/chai_tea.png', 100),
(58, 2, 'Oolong Tea', '1', 'OOL', 'img-menu/oolong_tea.png', 100),
(59, 2, 'Herbal Tea', '1', 'HRB', 'img-menu/herbal_tea.png', 100),
(60, 2, 'Fruit Tea', '1', 'FRT', 'img-menu/fruit_tea.png', 100),
(61, 3, 'Ham & Cheese Sandwich', '1', 'HCS', 'img-menu/ham_cheese.png', 85),
(62, 3, 'Tuna Sandwich', '1', 'TNS', 'img-menu/tuna_sandwich.png', 85),
(63, 3, 'Clubhouse', '1', 'CLB', 'img-menu/clubhouse.png', 120),
(64, 3, 'Breakfast Plate', '1', 'BFP', 'img-menu/breakfast_plate.png', 150),
(65, 3, 'Chicken Wings', '1', 'WNG', 'img-menu/chicken_wings.png', 140),
(66, 3, 'Fries', '1', 'FRS', 'img-menu/fries.png', 60),
(67, 3, 'Bacon & Egg', '1', 'BNE', 'img-menu/bacon_egg.png', 100),
(68, 3, 'Cheesy Nachos', '1', 'NCH', 'img-menu/cheesy_nachos.png', 90),
(69, 3, 'Garlic Bread', '1', 'GRB', 'img-menu/garlic_bread.png', 50),
(70, 3, 'Sausage Rice', '1', 'SRC', 'img-menu/sausage_rice.png', 110),
(71, 4, 'Chocolate Cake', '1', 'CHK', 'img-menu/chocolate_cake.png', 90),
(72, 4, 'Cheesecake', '1', 'CSK', 'img-menu/cheesecake.png', 100),
(73, 4, 'Brownie', '1', 'BRW', 'img-menu/brownie.png', 70),
(74, 4, 'Ice Cream Scoop', '1', 'ICS', 'img-menu/ice_cream.png', 60),
(75, 4, 'Tiramisu', '1', 'TRM', 'img-menu/tiramisu.png', 95),
(76, 4, 'Mango Float', '1', 'MGF', 'img-menu/mango_float.png', 85),
(77, 4, 'Leche Flan', '1', 'LCF', 'img-menu/leche_flan.png', 70),
(78, 4, 'Ube Halaya', '1', 'UBE', 'img-menu/ube_halaya.png', 80),
(79, 4, 'Cream Puff', '1', 'CRP', 'img-menu/cream_puff.png', 75),
(80, 4, 'Churros', '1', 'CHR', 'img-menu/churros.png', 85);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`categoryID`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`productID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `categoryID` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `productID` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=81;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
