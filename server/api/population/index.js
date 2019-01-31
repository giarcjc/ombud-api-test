const router = require('express').Router();
const populationController = require('./population-controller');

router.route('/growth').get(populationController.handleGrowth);
router.route('/').get(populationController.handlePopulation);

module.exports = router;
