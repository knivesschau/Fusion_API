/* create users table, make foreign key relation based on which user wrote a fused recipe */
CREATE TABLE fusion_users (
    user_id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY, 
    user_name TEXT NOT NULL UNIQUE, 
    password TEXT NOT NULL, 
    date_created TIMESTAMPTZ DEFAULT now() NOT NULL 
);

ALTER TABLE fused_recipes 
    ADD COLUMN
        author_id INTEGER REFERENCES fusion_users(user_id) ON DELETE CASCADE; 