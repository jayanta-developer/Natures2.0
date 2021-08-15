const express = require('express');
//Rout
const router = express.Router();
const userController = require('./../Controller/userController');
const AuthController = require('./../Controller/AuthController');

// User SignUP
router.post('/signup', userController.signup);
router.post('/login', userController.login);

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
  .get(
    AuthController.protectRoute,
    AuthController.restrictTo('admin', 'lead-guide'),
    userController.getUser
  );

router.patch('/updateMe', AuthController.protectRoute, userController.updateMe);

// Get User by ID
router
  .route('/:id')
  .get(
    AuthController.protectRoute,
    AuthController.restrictTo('admin', 'lead-guide'),
    userController.getUserById
  )
  // .patch(AuthController.protectRoute, userController.updateUser)
  .delete(
    AuthController.protectRoute,
    AuthController.restrictTo('admin', 'lead-guide'),
    userController.deleteUser
  );

module.exports = router;
