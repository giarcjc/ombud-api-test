const bunyan = require('bunyan');

const level = process.env.BUNYAN_LOG_LEVEL || 'debug';

const logger = bunyan.createLogger({
  name: 'Consumer-Complaint-Query-and-Aggregation-API',
  level,
});

module.exports = logger;
