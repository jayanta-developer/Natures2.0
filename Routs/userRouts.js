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
router.patch('/updatePassword', AuthController.updatePassword);

//Protect all route
router.use(AuthController.protectRoute)

//get me
router
.route('/me')
.get(userController.getMe, userController.getUserById)

router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);


//restrict route
router.use(AuthController.restrictTo('admin', 'lead-guide'))

//get all users
router
  .route('/')
  .get(userController.getUser);

// Get User by ID
router
  .route('/:id')
  .get(userController.getUserById)
  .delete(userController.deleteByID)
  .patch(userController.updatedUser)

module.exports = router;
