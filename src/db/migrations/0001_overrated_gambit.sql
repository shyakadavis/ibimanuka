ALTER TABLE "riddles" ALTER COLUMN "categories" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "riddles" ALTER COLUMN "hints" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "description" varchar(256) NOT NULL;