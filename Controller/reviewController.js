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
  console.log(req.user);
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.author) req.body.author = req.user._id;

  console.log(req.body.author);

  const review = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    result: review.length,
    data: {
      review,
    },
  });
});
