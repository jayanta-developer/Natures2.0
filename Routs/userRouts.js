const express = require('express');
//Rout
const router = express.Router();
const userController = require('./../Controller/userController');

// User SignUP
router.post('/signup', userController.signup);
router.post('/login', userController.login);

//forgot Password
router.post('/forgotPassword', userController.forgotPassword);
router.patch('/resetPassword/:token', userController.resetPassword);
router.patch('/updatePassword', userController.protectRoute, userController.updatePassword)

//user route
router
  .route('/')
  .get(userController.protectRoute, userController.restrictTo('admin', 'lead-guide'), userController.getUser)

// Get User by ID
router
  .route('/:id')
  .get(userController.protectRoute, userController.restrictTo('admin', 'lead-guide'), userController.getUserById)
  .patch(userController.protectRoute, userController.updateUser)
  .delete(userController.protectRoute, userController.restrictTo('admin', 'lead-guide'), userController.deleteUser);

module.exports = router;
