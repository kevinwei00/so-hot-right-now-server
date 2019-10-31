module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  API_TOKEN: process.env.API_TOKEN || 'dummy-api-token',
  INDEED_PUBLISHER_ID: process.env.INDEED_PUBLISHER_ID || '1234567891234567',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://Kein@localhost/so-hot-right-now',
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://Kein@localhost/so-hot-right-now-test',
};
