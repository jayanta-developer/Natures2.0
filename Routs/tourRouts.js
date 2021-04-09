const express = require('express');
const tourController = require('./../Controller/tourController');
const { route } = require('./userRouts');
//Rout
const router = express.Router();
// router.param('id', tourController.checkID);

//tour route
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.creatTour);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/:id')
  .get(tourController.getTourById)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
