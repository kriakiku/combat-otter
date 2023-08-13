CREATE TABLE `history` (
	`id` integer PRIMARY KEY NOT NULL,
	`type` text,
	`value` integer,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE INDEX `typeIdx` ON `history` (`type`);