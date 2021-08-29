const express = require('express');
const reviewControler = require('../Controller/reviewController');
const AuthController = require('../Controller/AuthController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(AuthController.protectRoute, AuthController.restrictTo('user'), reviewControler.getAllReview)
  .post(AuthController.protectRoute, AuthController.restrictTo('user'), reviewControler.createReview);

module.exports = router;
