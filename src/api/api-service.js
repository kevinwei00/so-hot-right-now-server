const APIService = {
  getAllCategories(db) {
    return db.select('*').from('categories');
  },

  getCategory(db, category_id) {
    return db
      .select('*')
      .from('categories')
      .where('id', category_id)
      .first();
  },

  getAllToolsForCategory(db, category_id) {
    return db
      .select('tool_id', 'tool_name', 'keywords', 'website', 'logo')
      .from('tools')
      .join('categories_tools', 'categories_tools.tool_id', 'tools.id')
      .join('categories', 'categories.id', 'categories_tools.category_id')
      .where({ category_id });
  },

  getToolForCategory(db, category_id, tool_id) {
    return db
      .select('tool_id', 'tool_name', 'keywords', 'website', 'logo')
      .from('tools')
      .join('categories_tools', 'categories_tools.tool_id', 'tools.id')
      .join('categories', 'categories.id', 'categories_tools.category_id')
      .where({ category_id, tool_id })
      .first();
  },
};

module.exports = APIService;
