CREATE TABLE categories_tools (
  category_id TEXT REFERENCES categories(id),
  tool_id TEXT REFERENCES tools(id),
  PRIMARY KEY (category_id, tool_id)
);