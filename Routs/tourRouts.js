const express = require('express');
const tourController = require('./../Controller/tourController');
const AuthController = require('../Controller/AuthController')
const { route } = require('./userRouts');
//Rout
const router = express.Router();
// router.param('id', tourController.checkID);

//tour route
router
  .route('/')
  .get(AuthController.protectRoute, tourController.getAllTours)
  .post(AuthController.protectRoute, AuthController.restrictTo('admin', 'lead-guide'), tourController.creatTour);

router.route('/tour-stats').get(AuthController.protectRoute, AuthController.restrictTo('admin', 'lead-guide'), tourController.getTourStats);
router.route('/monthly-plan/:year').get(AuthController.protectRoute, AuthController.restrictTo('admin', 'lead-guide'), tourController.getMonthlyPlan);

router
  .route('/:id')
  .get(AuthController.protectRoute, tourController.getTourById)
  .patch(AuthController.protectRoute, AuthController.restrictTo('admin', 'lead-guide'), tourController.updateTour)
  .delete(AuthController.protectRoute, AuthController.restrictTo('admin', 'lead-guide'), tourController.deleteTour);

module.exports = router;
