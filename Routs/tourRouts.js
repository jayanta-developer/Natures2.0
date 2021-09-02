const express = require('express');
const tourController = require('./../Controller/tourController');
const AuthController = require('../Controller/AuthController');
const ReviewRouter = require('../Routs/reviewRoutes');
const { route } = require('./userRouts');
//Rout
const router = express.Router();
// router.param('id', tourController.checkID);

//Delete all tour data
// router.route('/delTours').get(tourController.deletAllTours)

//Nested route
router.use('/:tourId/review', ReviewRouter)

//tour route
router
.route('/')
.get(tourController.getAllTours)
.post(AuthController.restrictTo('admin', 'lead-guide'), tourController.creatTour)

router.route('/tour-stats').get( AuthController.restrictTo('admin', 'lead-guide'), tourController.getTourStats);
router.route('/monthly-plan/:year').get(AuthController.restrictTo('admin', 'lead-guide'), tourController.getMonthlyPlan);

router
.route('/:id')
.get(tourController.getTourById)
.patch(AuthController.restrictTo('admin', 'lead-guide'), tourController.updateTour)
.delete(AuthController.restrictTo('admin', 'lead-guide'), tourController.deleteTour);

module.exports = router;
