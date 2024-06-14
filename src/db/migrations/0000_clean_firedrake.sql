DO $$ BEGIN
 CREATE TYPE "public"."complexity_level" AS ENUM('LEVEL_1', 'LEVEL_2', 'LEVEL_3', 'LEVEL_4', 'LEVEL_5', 'LEVEL_6', 'LEVEL_7');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "categories" (
	"id" varchar(16) PRIMARY KEY NOT NULL,
	"name" varchar(16) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "riddles" (
	"id" varchar(16) PRIMARY KEY NOT NULL,
	"question" varchar(256) NOT NULL,
	"answer" varchar(16) NOT NULL,
	"categories" varchar(16)[] DEFAULT ARRAY[]::varchar[] NOT NULL,
	"hints" varchar(256)[] DEFAULT ARRAY[]::varchar[] NOT NULL,
	"complexity_level" "complexity_level" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
