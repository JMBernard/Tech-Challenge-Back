CREATE DATABASE techchallenge; 
USE techchallenge;

DROP TABLE IF EXISTS `argonautes`;
CREATE TABLE `argonautes` (
    `id` INT AUTO_INCREMENT NOT NULL ,
    `name` VARCHAR(100) NOT NULL,
    `qualities` VARCHAR(100) NULL,
    PRIMARY KEY (
        `id`
    )
);