CREATE TABLE IF NOT EXISTS "mountains" (
	"id" varchar(16) PRIMARY KEY NOT NULL,
	"name" varchar(16) NOT NULL,
	"description" varchar(256) NOT NULL,
	"elevation" double precision NOT NULL,
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL,
	"native_name" varchar(16),
	"hints" varchar(16)[],
	"location" varchar(16) NOT NULL,
	"parent_range" varchar(16),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "mountains_name_unique" UNIQUE("name")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mountains" ADD CONSTRAINT "mountains_location_villages_id_fk" FOREIGN KEY ("location") REFERENCES "public"."villages"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "mountains_name_index" ON "mountains" USING btree ("name");