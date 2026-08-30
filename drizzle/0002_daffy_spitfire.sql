CREATE TABLE `storeOrders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` varchar(96) NOT NULL,
	`customerEmail` varchar(320) NOT NULL,
	`amountUsd` varchar(32) NOT NULL,
	`currency` varchar(16) NOT NULL DEFAULT 'USD',
	`status` enum('pending','paid','paid_over','wrong_amount','failed','cancelled') NOT NULL DEFAULT 'pending',
	`invoiceUuid` varchar(96),
	`invoiceUrl` varchar(512),
	`itemsJson` text NOT NULL,
	`paidAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `storeOrders_id` PRIMARY KEY(`id`),
	CONSTRAINT `storeOrders_orderId_unique` UNIQUE(`orderId`)
);
