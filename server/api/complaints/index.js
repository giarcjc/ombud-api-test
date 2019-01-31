const router = require('express').Router();
const complaintsController = require('./complaints-controller');

router.route('/products').get(complaintsController.handleProducts);
router.route('/states').get(complaintsController.handleStates);

// order matters! these routes must be last
router.route('/').get(complaintsController.handleComplaints);
router.route('/:id').get(complaintsController.handleAComplaintById);

module.exports = router;
