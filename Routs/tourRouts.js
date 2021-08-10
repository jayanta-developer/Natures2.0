const express = require('express');
const tourController = require('./../Controller/tourController');
const userController = require('../Controller/userController')
const { route } = require('./userRouts');
//Rout
const router = express.Router();
// router.param('id', tourController.checkID);

//tour route
router
  .route('/')
  .get(userController.protectRoute, tourController.getAllTours)
  .post(userController.protectRoute, userController.restrictTo('admin', 'lead-guide'), tourController.creatTour);

router.route('/tour-stats').get(userController.protectRoute, userController.restrictTo('admin', 'lead-guide'), tourController.getTourStats);
router.route('/monthly-plan/:year').get(userController.protectRoute, userController.restrictTo('admin', 'lead-guide'), tourController.getMonthlyPlan);

router
  .route('/:id')
  .get(userController.protectRoute, tourController.getTourById)
  .patch(userController.protectRoute, userController.restrictTo('admin', 'lead-guide'), tourController.updateTour)
  .delete(userController.protectRoute, userController.restrictTo('admin', 'lead-guide'), tourController.deleteTour);

module.exports = router;
