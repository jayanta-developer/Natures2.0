const User = require('../Models/userModels');
const AppError = require('../Utils/appError');
const catchAsync = require('../Utils/catchAsync');
const fectory = require('./fectoryHandeler');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

//Update the curent user
exports.updateMe = catchAsync(async (req, res, next) => {
  //Send err if user update password or confirmPassword...!
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

exports.getMe = catchAsync(async (req, res, next)=>{
  req.params.id = req.user.id  
  next()
})

//delete by Id
exports.deleteByID = fectory.deleteDos(User);
//update user
exports.updatedUser = fectory.updateDoc(User);
//Get user by id
exports.getUserById = fectory.getOneDoc(User);
//Get All user
exports.getUser = fectory.getAllDoc(User);
