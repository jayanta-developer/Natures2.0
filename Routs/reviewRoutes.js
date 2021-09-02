const express = require('express');
const reviewControler = require('../Controller/reviewController');
const AuthController = require('../Controller/AuthController');
const router = express.Router({ mergeParams: true });

router.use(AuthController.protectRoute)
router
  .route('/')
  .get(reviewControler.getAllReview)
  .post(AuthController.restrictTo('user', 'lead-guide'), reviewControler.setId, reviewControler.createReview);

router
  .route('/:id')
  .get(reviewControler.getReviewById)
  .delete(AuthController.restrictTo('user', 'admin'), reviewControler.deleteReview)
  .patch(AuthController.restrictTo('user', 'admin'), reviewControler.updateReview)

module.exports = router;
