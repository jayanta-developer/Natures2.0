//User handler..
const User = require('../Models/userModels');
const catchAsync = require('../Utils/catchAsync');
const jwt = require('jsonwebtoken');

exports.getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'err',
    message: 'This rout is not yet defined',
  });
};

exports.signup = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.create({ name, email, password });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_TOKEN, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(201).json({
    status: 'success',
    token,
    data: user,
  });
});

exports.getUser = catchAsync(async (req, res) => {
  const user = await User.find();
  res.status(200).json({
    status: 'success',
    data: user,
  });
});

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'err',
    message: 'This rout is not yet defined',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'err',
    message: 'This rout is not yet defined',
  });
};
