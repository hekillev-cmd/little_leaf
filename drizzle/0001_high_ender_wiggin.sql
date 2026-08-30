CREATE TABLE `storeProducts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`title` varchar(240) NOT NULL,
	`category` varchar(120) NOT NULL,
	`price` varchar(32) NOT NULL,
	`coverKey` varchar(512) NOT NULL,
	`coverUrl` varchar(512) NOT NULL,
	`fileKey` varchar(512) NOT NULL,
	`fileUrl` varchar(512) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `storeProducts_id` PRIMARY KEY(`id`)
);
