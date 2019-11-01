CREATE TABLE categories (
  id TEXT PRIMARY KEY NOT NULL,
  category_name TEXT NOT NULL,
  time_created TIMESTAMP NOT NULL DEFAULT now()
);