ALTER TABLE "mountains" ALTER COLUMN "description" SET DATA TYPE jsonb USING description::jsonb;
