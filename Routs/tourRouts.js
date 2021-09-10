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
.post(AuthController.protectRoute, AuthController.restrictTo('admin', 'lead-guide'), tourController.creatTour)

router.use(AuthController.protectRoute);

router.route('/tour-stats').get(AuthController.restrictTo('admin', 'lead-guide'), tourController.getTourStats);
router.route('/monthly-plan/:year').get(AuthController.restrictTo('admin', 'lead-guide'), tourController.getMonthlyPlan)

router
.route('/:id')
.get(tourController.getTourById)
.delete(AuthController.restrictTo('admin', 'lead-guide'), tourController.deleteTour)
.patch(AuthController.restrictTo('admin', 'lead-guied'), tourController.updateTour)

module.exports = router;
