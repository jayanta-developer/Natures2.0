const Review = require('../Models/reviewModels');
const catchAsync = require('../Utils/catchAsync');

exports.getAllReview = catchAsync(async (req, res, next) => {
  const review = await Review.find();

  res.status(200).json({
    status: 'success',
    result: review.length,
    data: {
      review,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const review = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    result: review.length,
    data: {
      review,
    },
  });
});
