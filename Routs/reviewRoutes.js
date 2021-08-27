const express = require('express');
const reviewControler = require('../Controller/reviewController');
const AuthController = require('../Controller/AuthController');

const router = express.Router();

router
  .route('/')
  .get(AuthController.protectRoute, reviewControler.getAllReview)
  .post(
    AuthController.protectRoute,
    AuthController.restrictTo('user', "admin"),
    reviewControler.createReview
  );

module.exports = router;
