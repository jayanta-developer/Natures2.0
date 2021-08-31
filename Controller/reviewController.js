const Review = require('../Models/reviewModels');
const catchAsync = require('../Utils/catchAsync');
const fectory = require('./fectoryHandeler');

exports.getAllReview = catchAsync(async (req, res, next) => {
  let filter = {};
  //Check for tourId
  if (req.params.tourId) filter = { tour: req.params.tourId };
  const review = await Review.find(filter);

  res.status(200).json({
    status: 'success',
    result: review.length,
    data: {
      review,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.author) req.body.author = req.user._id;

  const review = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    result: review.length,
    data: {
      review,
    },
  });
});

//delete review by id
exports.deleteReview = fectory.deleteDos(Review);