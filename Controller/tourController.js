const fs = require('fs');
const Tour = require('./../Models/TourModels');
const APIFeatures = require('./../Utils/apiFeatures');
const catchAsync = require('./../Utils/catchAsync');
const AppError = require('./../Utils/appError');

//Delet all tours data
// exports.deletAllTours = catchAsync(async (req, res, next)=> {
//  const deleteData = await Tour.deleteMany()
//   console.log(deleteData)
//   res.send('all data deleted..')
// });

//Tour handler.
//Make catchAsync fun for handle error in one function.
exports.getAllTours = catchAsync(async (req, res, next) => {
  //Execute query
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;

  res.status(200).json({
    status: 'success',
    results: [`We have(${tours.length}) tours.`],
    data: {
      tours,
    },
  });
});

exports.getTourById = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id)
  if (!tour) {
    return next(
      new AppError(`No tour found with that ID ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
});

exports.creatTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const updateTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: updateTour,
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(
      new AppError(`No tour found with that ID ${req.params.id}`, 404)
    );
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

//Aggregate
//for Grouping file
exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingQuantity' },
        avgRating: { $avg: '$ratingAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    { $project: { numRatings: 0 } },

    {
      $sort: { avgPrice: 1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1; //2021
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);
  res.status(200).json({
    status: 'success',
    TotalResult: plan.length,
    data: {
      plan,
    },
  });
});
