//User handler..
const User = require('../Models/userModels');
const catchAsync = require('../Utils/catchAsync');


exports.getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'err',
    message: 'This rout is not yet defined',
  });
};

exports.signup = catchAsync( async (req, res) => {
  const user = await User.create(req.body);
  console.log(user);

  res.status(201).json({
    status: 'success',
    data: user,
  });
});

exports.getUser = catchAsync(async (req, res) => {
  const user = await User.find();
  res.status(200).json({
    status: 'success',
    data: user,
  })
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
