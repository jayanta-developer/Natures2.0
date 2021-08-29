const express = require('express');
//Rout
const router = express.Router();
const userController = require('./../Controller/userController');
const AuthController = require('./../Controller/AuthController');

// User SignUP
router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);

//forgot Password
router.post('/forgotPassword', AuthController.forgotPassword);
router.patch('/resetPassword/:token', AuthController.resetPassword);
router.patch(
  '/updatePassword',
  AuthController.protectRoute,
  AuthController.updatePassword
);

//user route
router
  .route('/')
  .get(userController.getUser);
  // .get(AuthController.protectRoute, AuthController.restrictTo('admin', 'lead-guide'), userController.getUser);

router.patch('/updateMe', AuthController.protectRoute, userController.updateMe);
router.delete('/deleteMe', AuthController.protectRoute, userController.deleteMe)

// Get User by ID
router
  .route('/:id')
  .get(AuthController.protectRoute, AuthController.restrictTo('admin', 'lead-guide'), userController.getUserById)
  // .patch(AuthController.protectRoute, userController.updateUser)
  .delete(AuthController.protectRoute, AuthController.restrictTo('admin', 'lead-guide', 'user'), userController.deleteByID);

module.exports = router;
