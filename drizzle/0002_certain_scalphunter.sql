CREATE TABLE `post_gallery_images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` int NOT NULL,
	`imageUrl` text NOT NULL,
	`caption` varchar(255),
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `post_gallery_images_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `post_gallery_images` ADD CONSTRAINT `post_gallery_images_postId_posts_id_fk` FOREIGN KEY (`postId`) REFERENCES `posts`(`id`) ON DELETE no action ON UPDATE no action;