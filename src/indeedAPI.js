const axios = require('axios');
const { INDEED_PUBLISHER_ID } = require('./config');
const ENDPOINT = 'https://api.indeed.com/ads/apisearch';
const PUBLISHER_ID = `?publisher=${INDEED_PUBLISHER_ID}`;
const PARAMS = 'v=2&limit=0&format=json';
const BASE_QUERY = 'q=title%3A%28developer+OR+engineer%29+';

function GetNumJobListingsFor(keywordsArray, useAnd) {
  const queryString = composeQueryString(keywordsArray, useAnd);
  const url = composeURL(queryString);
  return axios
    .get(url)
    // .then((response) => {
    //   if (!response.ok) {
    //     const error = new Error(response.statusText);
    //     error.response = response;
    //     throw error;
    //   }
    //   return response.json();
    // })
    // .then((responseData) => {
    //   return responseData ? responseData.totalResults : -1;
    // })
    .then((res) => res.data.totalResults)
    .catch((error) => console.error(error));
}

function composeQueryString(keywordsArray, useAnd) {
  const keywordsWithQuotes = keywordsArray.map(
    (keyword) => `%22${encodeURIComponent(keyword)}%22`
  );
  const keywordsCombined = keywordsWithQuotes.join(useAnd ? '+AND+' : '+OR+');
  return `%28${keywordsCombined}%29`;
}

function composeURL(queryString) {
  return `${ENDPOINT}${PUBLISHER_ID}&${PARAMS}&${BASE_QUERY}${queryString}`;
}

module.exports.GetNumJobListingsFor = GetNumJobListingsFor;
