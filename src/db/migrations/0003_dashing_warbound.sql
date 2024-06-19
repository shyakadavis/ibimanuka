DO $$ BEGIN
 CREATE TYPE "public"."role" AS ENUM('USER', 'ADMIN');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" varchar(16) PRIMARY KEY NOT NULL,
	"name" varchar(64) NOT NULL,
	"given_name" varchar(64),
	"surname" varchar(64),
	"email" varchar(256) NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"hashed_password" varchar,
	"role" "role" DEFAULT 'USER' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_email_index" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_name_index" ON "users" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "categories_name_index" ON "categories" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "riddles_question_index" ON "riddles" USING btree ("question");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "riddles_answer_index" ON "riddles" USING btree ("answer");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "riddles_categories_index" ON "riddles" USING btree ("categories");