const express = require('express');
const APIService = require('./api-service');
const APIRouter = express.Router();

// returns all categories
APIRouter.route('/categories').get((req, res, next) => {
  APIService.getAllCategories(req.app.get('db'))
    .then((categories) => {
      return res.json(categories);
    })
    .catch(next);
});

// returns specified category
APIRouter.route('/categories/:category_id')
  .all(checkCategoryExists)
  .get((req, res) => {
    return res.json(res.category);
  });

// returns all tools for specified category
APIRouter.route('/categories/:category_id/tools')
  .all(checkCategoryExists)
  .get((req, res, next) => {
    APIService.getAllToolsForCategory(req.app.get('db'), req.params.category_id)
      .then((tools) => {
        return res.json(tools);
      })
      .catch(next);
  });

// returns specified tool for specified category
APIRouter.route('/categories/:category_id/tools/:tool_id')
  .all(checkCategoryExists)
  .get((req, res, next) => {
    APIService.getToolForCategory(
      req.app.get('db'),
      req.params.category_id,
      req.params.tool_id
    )
      .then((tool) => {
        if (!tool) {
          return res.status(404).json({
            error: 'Tool does not exist',
          });
        }
        return res.json(tool);
      })
      .catch(next);
  });

async function checkCategoryExists(req, res, next) {
  try {
    const category = await APIService.getCategory(
      req.app.get('db'),
      req.params.category_id
    );

    if (!category) {
      return res.status(404).json({
        error: 'Category does not exist',
      });
    }

    res.category = category;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = APIRouter;
