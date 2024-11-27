# CS3733-JOJO-Final
Traver Smith, James Barmakian, Ben Marsh, Nicolas Graham

Instructions: 
Admin username: admin, Admin password: jojosiwa
It is assumed the user will exit the application after each action and reopen the home page.



CREATE TABLE `Reservation` (
  `reservationID` int NOT NULL,
  `restaurantResID` varchar(45) DEFAULT NULL,
  `tableID` int DEFAULT NULL,
  `reserveTime` time DEFAULT NULL,
  `userEmail` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`reservationID`),
  KEY `restaurantResID_idx` (`restaurantResID`),
  KEY `tableID_idx` (`tableID`),
  CONSTRAINT `restaurantResID` FOREIGN KEY (`restaurantResID`) REFERENCES `Restaurant` (`address`),
  CONSTRAINT `tableID` FOREIGN KEY (`tableID`) REFERENCES `Tables` (`tableID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci


CREATE TABLE `Restaurant` (
  `restaurantPassword` int DEFAULT NULL,
  `address` varchar(45) NOT NULL,
  `restaurantName` varchar(45) DEFAULT NULL,
  `closeTime` time DEFAULT NULL,
  `openTime` time DEFAULT NULL,
  `closedDays` varchar(45) DEFAULT NULL,
  `isActive` tinyint DEFAULT NULL,
  PRIMARY KEY (`address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci


CREATE TABLE `Tables` (
  `tableID` int NOT NULL AUTO_INCREMENT,
  `numSeats` int DEFAULT NULL,
  `tableNum` int DEFAULT NULL,
  `restaurantID` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`tableID`),
  KEY `restaurantID_idx` (`restaurantID`),
  CONSTRAINT `restaurantID` FOREIGN KEY (`restaurantID`) REFERENCES `Restaurant` (`address`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
