const logger = require('../logger');

const handleError = (err, req, res, next) => {
  const isProd = process.env.NODE_ENV === 'production';
  const connectionRefused = err.message.indexOf('ECONNREFUSED') > -1;
  const noLivingConnection = err.message.toLowerCase().indexOf('no living connections') > -1;
  const reqTimeout = err.status === 408 || err.status === 504;
  const serviceUnavailable = err.status === 503
    || noLivingConnection || connectionRefused || reqTimeout;

  if (err) {
    logger.error(err);
    if (serviceUnavailable) {
      if (!isProd) {
        return res.status(err.status || 503).json({
          error: 'Database Connection Unavailable',
          status: err.code,
          message: err.message,
          stacktrace: err,
          isProd,
        });
      }
      return res.status(err.status || 503).json({
        error: 'Database Connection Unavailable',
        status: err.code,
      });
    }
    if (err.status === 400) {
      return res.status(400).json({
        error: 'There was a problem with your request. Please check the API documentation and try again.',
        status: 400,
      });
    }
    return next(err);
  }
  return next();
};

module.exports = handleError;
