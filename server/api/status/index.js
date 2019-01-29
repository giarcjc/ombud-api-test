const router = require('express').Router();
const pkg = require('../../../package.json');
const connection = require('../../db/connection');
const logger = require('../../logger');

const getStatus = (req, res) => {
  res.status(200).json({
    status: 'all good!',
    version: pkg.version,
    name: pkg.name,
    description: pkg.description,
  });
};

const getDBConnectionStatus = async (req, res, next) => {
  try {
    const dbStatus = await connection.checkConnection();
    logger.info(dbStatus);
    res.send(dbStatus);
  } catch (err) {
    logger.error('Could not get DB status!');
    next(err);
  }
};

router.route('/').get(getStatus);
router.route('/db').get(getDBConnectionStatus);

module.exports = router;
