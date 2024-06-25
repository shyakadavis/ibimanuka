CREATE TABLE IF NOT EXISTS "cells" (
	"id" varchar(16) PRIMARY KEY NOT NULL,
	"name" varchar(16) NOT NULL,
	"description" varchar(256) NOT NULL,
	"sector_id" varchar(16) NOT NULL,
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "cells_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "districts" (
	"id" varchar(16) PRIMARY KEY NOT NULL,
	"name" varchar(16) NOT NULL,
	"description" varchar(256) NOT NULL,
	"province_id" varchar(16) NOT NULL,
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "districts_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "provinces" (
	"id" varchar(16) PRIMARY KEY NOT NULL,
	"name" varchar(16) NOT NULL,
	"description" varchar(256) NOT NULL,
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "provinces_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sectors" (
	"id" varchar(16) PRIMARY KEY NOT NULL,
	"name" varchar(16) NOT NULL,
	"description" varchar(256) NOT NULL,
	"district_id" varchar(16) NOT NULL,
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sectors_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "villages" (
	"id" varchar(16) PRIMARY KEY NOT NULL,
	"name" varchar(16) NOT NULL,
	"description" varchar(256) NOT NULL,
	"sector_id" varchar(16) NOT NULL,
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "villages_name_unique" UNIQUE("name")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cells" ADD CONSTRAINT "cells_sector_id_sectors_id_fk" FOREIGN KEY ("sector_id") REFERENCES "public"."sectors"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "districts" ADD CONSTRAINT "districts_province_id_provinces_id_fk" FOREIGN KEY ("province_id") REFERENCES "public"."provinces"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sectors" ADD CONSTRAINT "sectors_district_id_districts_id_fk" FOREIGN KEY ("district_id") REFERENCES "public"."districts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "villages" ADD CONSTRAINT "villages_sector_id_cells_id_fk" FOREIGN KEY ("sector_id") REFERENCES "public"."cells"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cells_name_index" ON "cells" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "districts_name_index" ON "districts" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "provinces_name_index" ON "provinces" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sectors_name_index" ON "sectors" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "villages_name_index" ON "villages" USING btree ("name");