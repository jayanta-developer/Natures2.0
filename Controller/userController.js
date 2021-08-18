const User = require('../Models/userModels');
const AppError = require('../Utils/appError');
const catchAsync = require('../Utils/catchAsync');
const creactSendToken = require('../Utils/token');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

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

//Delet Me
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { Active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
