CREATE TABLE `ask_questions` (
	`id` text PRIMARY KEY NOT NULL,
	`question` text NOT NULL,
	`answer` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`show_on_ask` integer DEFAULT false NOT NULL,
	`show_on_profile` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`answered_at` integer
);
--> statement-breakpoint
CREATE INDEX `idx_ask_questions_created_at` ON `ask_questions` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_ask_questions_show_on_ask` ON `ask_questions` (`show_on_ask`);--> statement-breakpoint
CREATE INDEX `idx_ask_questions_show_on_profile` ON `ask_questions` (`show_on_profile`);