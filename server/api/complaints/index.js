const router = require('express').Router();
const complaintsController = require('./complaints-controller');
const logger = require('../../logger');

function dummy(req, res) {
  console.log('******************* I\'m just a big complaints dummy! *********');
  logger.debug(req.path);
  logger.debug(req.params);
  logger.debug(req.query);
  res.sendStatus(200);
}

router.route('/products').get(complaintsController.handleProducts);
router.route('/states').get(complaintsController.handleStates);

// order matters! these routes must be last
router.route('/').get(dummy);
router.route('/:complaint_id').get(dummy);

module.exports = router;
