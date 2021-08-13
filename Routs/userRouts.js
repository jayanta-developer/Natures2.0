const express = require('express');
//Rout
const router = express.Router();
const userController = require('./../Controller/userController');

//SignUP
router.post('/signup', userController.signup);
//Login
router.post('/login', userController.login);

//forgot Password
router.post('/forgotPassword', userController.forgotPassword);
router.patch('/resetPassword/:token', userController.resetPassword);

//user route
router
  .route('/')
  .get(userController.protectRoute, userController.restrictTo('admin', 'lead-guide'), userController.getUser)

// .post(userController.createUser);
router
  .route('/:id')
  .get(userController.restrictTo('admin', 'lead-guide'), userController.getUser)
  .patch(userController.protectRoute, userController.updateUser)
  .delete(userController.protectRoute, userController.restrictTo('admin', 'lead-guide'), userController.deleteUser);

module.exports = router;
