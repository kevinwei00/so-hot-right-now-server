/*******************************************************************
  IMPORTS
*******************************************************************/
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const validateBearerToken = require('./validateBearerToken');
const errorHandler = require('./errorHandler');
const indeedAPI = require('./indeedAPI');

/*******************************************************************
  INIT
*******************************************************************/
const app = express();

/*******************************************************************
  MIDDLEWARE
*******************************************************************/
app.use(morgan(NODE_ENV === 'production' ? 'tiny' : 'common'));
app.use(cors());
app.use(helmet());
app.use(express.json()); //parses JSON data of req body
app.use(validateBearerToken);

/*******************************************************************
  ROUTES
*******************************************************************/
app.post('/', (req, res) => {
  const { keywordsArray, useAnd } = req.body;
  indeedAPI.GetNumJobListingsFor(keywordsArray, useAnd).then((totalResults) => {
    if (totalResults === undefined) {
      return res.status(400).json(-1);
    }
    return res.status(200).json(totalResults);
  });
});

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
