ALTER TABLE base_recipes
    DROP COLUMN IF EXISTS cuisine_id;

ALTER TABLE fused_recipes
    DROP COLUMN IF EXISTS base_cuisine;
    
ALTER TABLE fused_recipes
    DROP COLUMN IF EXISTS fuse_cuisine;

DROP TABLE IF EXISTS cuisines;