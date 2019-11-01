CREATE TABLE tools (
  id TEXT PRIMARY KEY NOT NULL,
  tool_name TEXT NOT NULL,
  keywords TEXT ARRAY NOT NULL,
  logo TEXT NOT NULL,
  website TEXT NOT NULL,
  time_created TIMESTAMP NOT NULL DEFAULT now()
);