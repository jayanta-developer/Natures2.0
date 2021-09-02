const fs = require('fs');
const Tour = require('./../Models/TourModels');
const catchAsync = require('./../Utils/catchAsync');
const fectory = require('./fectoryHandeler');


//Tour handler.

//Get All tours
exports.getAllTours = fectory.getAllDoc(Tour);
//Get tour by id
exports.getTourById = fectory.getOneDoc(Tour, { path: 'reviews' });
//Creact Tour
exports.creatTour = fectory.createDos(Tour);
//update Tour
exports.updateTour = fectory.updateDoc(Tour);
//delete tour
exports.deleteTour = fectory.deleteDos(Tour);

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
