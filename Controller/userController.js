//User handler..
const { promisify } = require('util');
const User = require('../Models/userModels');
const AppError = require('../Utils/appError');
const catchAsync = require('../Utils/catchAsync');
const jwt = require('jsonwebtoken');

//JWT Token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_TOKEN, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'err',
    message: 'This rout is not yet defined',
  });
};
//Create User
exports.signup = catchAsync(async (req, res) => {
  // const { name, email, password, passwordConfarmation } = req.body;
  const user = await User.create(req.body);

  const token = signToken(user._id);
  res.status(201).json({
    status: 'success',
    token,
    data: user,
  });
});

//Login User
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Email or Password is not provide', 400));
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('User or password is incoract', 401));
  }
  const token = signToken(user._id);
  res.status(200).json({
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

exports.protectRoute = catchAsync(async (req, res, next) => {
  //1)check for token is exiset
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('Your are not logged in! please login to get access', 401)
    );
  }
  //2)verify token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_TOKEN
  );
  //3)check user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }
  //4)check user change password before asine token
  if (await currentUser.AfterchangesPassword(decoded.iat)) {
    return next(
      new AppError('user recently changed password! Please log in again.', 401)
    );
  }
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action!', 403)
      );
    }

    next();
  };
};
