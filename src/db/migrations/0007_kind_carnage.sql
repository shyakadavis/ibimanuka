ALTER TABLE "villages" RENAME COLUMN "sector_id" TO "cell_id";--> statement-breakpoint
ALTER TABLE "villages" DROP CONSTRAINT "villages_sector_id_cells_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "villages" ADD CONSTRAINT "villages_cell_id_cells_id_fk" FOREIGN KEY ("cell_id") REFERENCES "public"."cells"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
