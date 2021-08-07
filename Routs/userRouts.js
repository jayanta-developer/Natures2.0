const express = require('express');
//Rout
const router = express.Router();
const userController = require('./../Controller/userController');

//SignUP
router.post('/signup', userController.signup)

//Login
router.post('/login', userController.login)

//user route
router
  .route('/')
  .get(userController.getUser)
  // .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
