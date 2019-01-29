const express = require('express');
const logger = require('./logger');

const port = process.env.PORT || 3000;
const app = express();

app.use('/api/v1/status', require('./api/status'));
app.use('/api/v1/population', require('./api/population'));
app.use('/api/v1/complaints', require('./api/complaints'));

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, (err) => {
    if (err) {
      logger.error(err);
    }

    logger.info(`App API Listening on Port ${port}`);
  });
}

module.exports = app;
