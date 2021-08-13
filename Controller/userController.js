//User handler..
const { promisify } = require('util');
const User = require('../Models/userModels');
const AppError = require('../Utils/appError');
const sendEmail = require('../Utils/email');
const catchAsync = require('../Utils/catchAsync');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

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
    return next(new AppError('User email or password is incoract', 401));
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

//Protect Route
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
    console.log('0 from rest');
    console.log('The role', roles.includes(req.user.role));

    if (!roles.includes(req.user.role)) {
      console.log('1 from rest');

      return next(
        new AppError('You do not have permission to perform this action!', 403)
      );
    }
    console.log('The role', roles.includes(req.user.role));
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //check the user email is exists.
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with this email adderss', 404));
  }

  //Genaret the rendam token
  const resetToken = user.CreateResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  //Send the token on this email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm
   to: ${resetURL}. \nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token is send to the user!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });
    console.log(err);
    return next(
      new AppError(
        `There was an error sending the email, Try again later! Error${err}`
      ),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //creact hash token by the normel token.
  const hashToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  //find the user base on the token.
  const user = await User.findOne({
    passwordResetToken: hashToken,
    passwordTokenExpires: { $gt: Date.now() },
  });

  //If token not expired and user is there then set the new password.
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  //Update changepasswordAt property for the users
  user.password = req.body.password;
  user.passwordConfarmation = req.body.passwordConfarmation;
  user.passwordResetToken = undefined;
  user.passwordTokenExpires = undefined;
  await user.save();
  //Log the user in and send JWT
  const token = signToken(user._id);
  console.log(token);
  res.status(200).json({
    status: 'success',
    token,
    data: user,
  });
});
