const User = require('../Models/userModels');
const AppError = require('../Utils/appError');
const catchAsync = require('../Utils/catchAsync');
const jwt = require('jsonwebtoken');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

//JWT Token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_TOKEN, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

//Send respons with token
const creactSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    status: 'success',
    token,
    data: user,
  });
};

//Create User
exports.signup = catchAsync(async (req, res) => {
  // const { name, email, password, passwordConfarmation } = req.body;
  const user = await User.create(req.body);
  creactSendToken(user, 201, res);
});

//Login User
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Email or Password is not provide', 400));
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('User email or password is incoract', 401));
  }
  creactSendToken(user, 200, res);
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.find();
  creactSendToken(user, 200, res);
});

exports.getUserById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  console.log(user);
  creactSendToken(user, 200, res);
});

//Update the curent user
exports.updateMe = catchAsync(async (req, res, next) => {
  //Send err if user update password or confirmPassword
  if (req.body.password || req.body.passwordConfarmation) {
    return next(
      new AppError(
        'This is not update password route. Please viset /updatePassword route',
        400
      )
    );
  }
  //if not then update the user
  const filterdBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterdBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'err',
    message: 'This rout is not yet defined',
  });
};
