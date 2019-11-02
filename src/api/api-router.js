const express = require('express');
const path = require('path');
const axios = require('axios');
const requireAuth = require('../bin/validateBearerToken');
const APIService = require('./api-service');
const APIRouter = express.Router();
const { INDEED_PUBLISHER_ID } = require('../config');
const INDEED_API_ENDPOINT = 'https://api.indeed.com/ads/apisearch';
const PUBLISHER_ID = `publisher=${INDEED_PUBLISHER_ID}`;
const PARAMS = 'v=2&limit=0&format=json';
const BASE_QUERY = 'q=title%3A%28developer+OR+engineer%29';

/*******************************************************************************
  ROUTES
********************************************************************************/

// returns all categories
APIRouter.route('/categories')
  .all(requireAuth)
  .get((req, res, next) => {
    APIService.getAllCategories(req.app.get('db'))
      .then((categories) => {
        return res.json(categories);
      })
      .catch(next);
  });

// returns specified category
APIRouter.route('/categories/:category_id')
  .all(requireAuth)
  .all(checkCategoryExists)
  .get((req, res) => {
    return res.json(res.category);
  });

// returns all tools for specified category
APIRouter.route('/categories/:category_id/tools')
  .all(requireAuth)
  .all(checkCategoryExists)
  .get((req, res, next) => {
    APIService.getAllToolsForCategory(req.app.get('db'), req.params.category_id)
      .then((tools) => {
        tools = tools.map((tool) => addLogoLink(tool, req, tool.logo));
        return res.json(tools);
      })
      .catch(next);
  });

// returns specified tool for specified category
APIRouter.route('/categories/:category_id/tools/:tool_id')
  .all(requireAuth)
  .all(checkCategoryExists)
  .all(checkToolExists)
  .get((req, res) => {
    const tool = addLogoLink(res.tool, req);
    return res.json(tool);
  });

// returns logo for specified tool of specified category
APIRouter.route('/categories/:category_id/tools/:tool_id/logo')
  .all(checkCategoryExists)
  .all(checkToolExists)
  .get((req, res) => {
    return res
      .status(200)
      .sendFile(`/logos/${req.params.tool_id}.png`, { root: process.cwd() });
  });

// returns number of job listings matching the supplied keywords using the Indeed API
APIRouter.route('/search')
  .all(requireAuth)
  .get((req, res, next) => {
    let { keywords, useAnd } = req.query;
    if (!keywords) {
      return res.status(400).json({
        error: 'Must supply parameter keywords',
      });
    }
    if (useAnd && useAnd !== 'true' && useAnd !== 'false') {
      return res.status(400).json({
        error: 'Parameter useAnd must be either true or false',
      });
    }
    // keywords string to array
    keywords = keywords.split(',');
    // useAnd string to boolean
    useAnd = useAnd === 'true';
    const queryString = composeQueryString(keywords, useAnd);
    const url = composeURL(queryString);
    return axios
      .get(url)
      .then((res) => res.data.totalResults)
      .then((totalResults) => {
        if (totalResults === undefined) {
          return res.status(400).json(-1);
        }
        return res.status(200).json({ queryString, totalResults });
      })
      .catch(next);
  });

/*******************************************************************************
  FUNCTIONS
********************************************************************************/
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

async function checkToolExists(req, res, next) {
  try {
    const tool = await APIService.getToolForCategory(
      req.app.get('db'),
      req.params.category_id,
      req.params.tool_id
    );

    if (!tool) {
      return res.status(404).json({
        error: 'Tool does not exist',
      });
    }

    res.tool = tool;
    next();
  } catch (error) {
    next(error);
  }
}

function addLogoLink(tool, req, tool_logo = '') {
  const logo = `${req.protocol}://${req.get('host')}${path.posix.join(
    `${req.originalUrl}/${tool_logo}/logo`
  )}`;
  tool.links = { logo };
  return tool;
}

function composeQueryString(keywords, useAnd) {
  const keywordsWithQuotes = keywords.map(
    (keyword) => `%22${encodeURIComponent(keyword)}%22`
  );
  const keywordsCombined = keywordsWithQuotes.join(useAnd ? '+AND+' : '+OR+');
  return `%28${keywordsCombined}%29`;
}

function composeURL(queryString) {
  return `${INDEED_API_ENDPOINT}?${PUBLISHER_ID}&${PARAMS}&${BASE_QUERY}+${queryString}`;
}

module.exports = APIRouter;
