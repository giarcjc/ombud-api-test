const express = require('express');
const logger = require('./logger');
const handleError = require('./middleware/error-middleware');

const port = process.env.PORT || 3000;
const app = express();

app.use('/api/v1/status', require('./api/status'));
app.use('/api/v1/population', require('./api/population'));
app.use('/api/v1/complaints', require('./api/complaints'));

app.use(handleError);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, (err) => {
    if (err) {
      logger.error(err);
    }

    logger.info(`App API Listening on Port ${port}`);
  });
}

process.on('unhandledRejection', (reason) => {
  logger.error('unhandledRejection: ', reason);
});

process.on('uncaughtException', (error) => {
  logger.error('uncaughtException: ', error);
});

module.exports = app;
