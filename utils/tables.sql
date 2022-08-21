CREATE DATABASE IF NOT EXISTS `cse311`;

USE `cse311`;

CREATE TABLE IF NOT EXISTS `credentials`(
    `id` CHAR(36) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` VARCHAR(255) NOT NULL DEFAULT 'applicant',
    `isBan` TINYINT(1) NOT NULL DEFAULT 0,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(`id`),
    UNIQUE KEY email(`email`)
) ENGINE = INNODB;

CREATE TABLE IF NOT EXISTS `users`(
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `photo` VARCHAR(255) DEFAULT NULL,
    `phone` VARCHAR(255) DEFAULT NULL,
    `address` VARCHAR(255) DEFAULT NULL,
    `cid` CHAR(36) NOT NULL,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(`id`),
    UNIQUE KEY `cid`(`cid`),
    CONSTRAINT `users_credentials` FOREIGN KEY(`cid`) REFERENCES credentials(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = INNODB;

CREATE TABLE IF NOT EXISTS `applicants`(
    `id` CHAR(36) NOT NULL,
    `cv` VARCHAR(255) NOT NULL,
    `dob` DATE NOT NULL,
    `skill` VARCHAR(255) NOT NULL,
    `status` VARCHAR(255) NOT NULL DEFAULT 'open',
    `education` VARCHAR(255) NOT NULL,
    `region` VARCHAR(255) NOT NULL,
    `country` VARCHAR(255) NOT NULL DEFAULT 'Bangladesh',
    `currentCompany` VARCHAR(255) DEFAULT NULL,
    `currentPosition` VARCHAR(255) DEFAULT NULL,
    `isCompleted` TINYINT(1) NOT NULL DEFAULT 0,
    `isVerified` TINYINT(1) NOT NULL DEFAULT 0,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `uid` CHAR(36) DEFAULT NULL,
    PRIMARY KEY(`id`),
    KEY `uid`(`uid`),
    CONSTRAINT `applicants_users` FOREIGN KEY(`uid`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = INNODB;

CREATE TABLE IF NOT EXISTS `recruiters`(
    `id` CHAR(36) NOT NULL,
    `companyName` VARCHAR(255) NOT NULL,
    `contactNumber` VARCHAR(255) NOT NULL,
    `yearOfEstablishment` VARCHAR(255) NOT NULL,
    `companyType` VARCHAR(255) NOT NULL DEFAULT 'open',
    `country` VARCHAR(255) NOT NULL DEFAULT 'Bangladesh',
    `region` VARCHAR(255) NOT NULL DEFAULT 'Dhaka',
    `companyAddress` VARCHAR(255) NOT NULL,
    `businessDescription` VARCHAR(255) NOT NULL,
    `tradeLicense` VARCHAR(255) NOT NULL,
    `websiteURL` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `uid` CHAR(36) DEFAULT NULL,
    PRIMARY KEY(`id`),
    KEY `uid`(`uid`),
    CONSTRAINT `recruiters_users` FOREIGN KEY(`uid`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = INNODB;

CREATE TABLE IF NOT EXISTS `admins`(
    `id` CHAR(36) NOT NULL,
    `uid` CHAR(36) NOT NULL,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(`id`),
    UNIQUE KEY `uid`(`uid`),
    CONSTRAINT `admins_users` FOREIGN KEY(`uid`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = INNODB;

CREATE TABLE IF NOT EXISTS `jobs`(
    `id` CHAR(36) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `deadline` DATE NOT NULL,
    `type` VARCHAR(255) NOT NULL DEFAULT 'fulltime',
    `placement` VARCHAR(255) NOT NULL DEFAULT 'remote',
    `salary` VARCHAR(255) NOT NULL DEFAULT '0-100',
    `location` VARCHAR(255) NOT NULL DEFAULT 'Dhaka, Bangladesh',
    `vacancy` INT(11) NOT NULL DEFAULT 1,
    `status` VARCHAR(255) NOT NULL DEFAULT 'open',
    `isVerified` TINYINT(1) NOT NULL DEFAULT 0,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `rid` CHAR(36) DEFAULT NULL,
    PRIMARY KEY(id),
    KEY `rid`(`rid`),
    CONSTRAINT `jobs_recruiters` FOREIGN KEY(`rid`) REFERENCES `recruiters`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = INNODB;

CREATE TABLE IF NOT EXISTS `jobApplications`(
    `id` CHAR(36) NOT NULL,
    `result` VARCHAR(255) NOT NULL DEFAULT 'pending',
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `jobId` CHAR(36) DEFAULT NULL,
    `applicantId` CHAR(36) DEFAULT NULL,
    PRIMARY KEY(`id`),
    UNIQUE KEY `jobApplications_applicantId_jobId_unique`(`jobId`, `applicantId`),
    KEY `applicantId`(`applicantId`),
    CONSTRAINT `jobApplications_jobs` FOREIGN KEY(`jobId`) REFERENCES `jobs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `jobApplications_applicants` FOREIGN KEY(`applicantId`) REFERENCES `applicants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = INNODB;