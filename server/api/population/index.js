const router = require('express').Router();
const populationController = require('./population-controller');
const logger = require('../../logger');

function dummy(req, res) {
  console.log('******************* I\'m just a big population dummy! *********');
  logger.debug(req.path);
  logger.debug(req.params);
  logger.debug(req.query);
  res.sendStatus(200);
}

router.route('/growth').get(populationController.handleGrowth);
router.route('/').get(dummy);

module.exports = router;
