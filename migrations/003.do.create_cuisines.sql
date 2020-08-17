CREATE TABLE cuisines (
    culinary_id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY, 
    cuisine_name TEXT NOT NULL
);

ALTER TABLE base_recipes 
    ADD COLUMN
        cuisine_id INTEGER REFERENCES cuisines(culinary_id) ON DELETE CASCADE;

ALTER TABLE fused_recipes
    ADD COLUMN
        base_cuisine INTEGER REFERENCES cuisines(culinary_id) ON DELETE CASCADE; 

ALTER TABLE fused_recipes
    ADD COLUMN
        fuse_cuisine INTEGER REFERENCES cuisines(culinary_id) ON DELETE CASCADE; 
