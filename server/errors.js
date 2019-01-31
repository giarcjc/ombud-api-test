const dbError = (err, req, res, next) => {
  if (err) {
    return res.status(502).json({
      error: 'Bad Gateway',
      reason: err.code,
      message: err.message,
      err,
    });
  }
  return next(err);
};


module.exports = {
  dbError,
};
