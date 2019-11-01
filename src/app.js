/*******************************************************************
  IMPORTS
*******************************************************************/
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const validateBearerToken = require('./bin/validateBearerToken');
const errorHandler = require('./bin/errorHandler');
const APIRouter = require('./api/api-router');

/*******************************************************************
  INIT
*******************************************************************/
const app = express();

/*******************************************************************
  MIDDLEWARE
*******************************************************************/
app.use(
  morgan(NODE_ENV === 'production' ? 'tiny' : 'common', {
    skip: () => NODE_ENV === 'test',
  })
);
app.use(cors());
app.use(helmet());
app.use(validateBearerToken);

/*******************************************************************
  ROUTES
*******************************************************************/
app.use('/api', APIRouter);

/*******************************************************************
  ERROR HANDLING
*******************************************************************/
// Catch-all 404 handler
app.use((req, res, next) => {
  const err = new Error('Path Not Found');
  err.status = 404;
  next(err); // goes to errorHandler
});
app.use(errorHandler);

/*******************************************************************
  EXPORTS
*******************************************************************/
module.exports = app;
