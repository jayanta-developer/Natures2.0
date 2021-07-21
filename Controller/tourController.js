const fs = require('fs');
const Tour = require('./../Models/TourModels');
const APIFeatures = require('./../Utils/apiFeatures');
const catchAsync = require('./../Utils/catchAsync');
const AppError = require('./../Utils/appError');

//Tour handler.

exports.getAllTours = catchAsync(async (req, res, next) => {
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach((el) => delete queryObj[el]);

  //Advanded filtering
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
  console.log(JSON.parse(queryStr));
  let query = Tour.find(JSON.parse(queryStr));

  if(req.query.sort){
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy)
  } else{
    query = query.sort('-createdAt')
  }

  if(req.query.fields){
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  }else{
    query = query.select('-__v')
  }


//Pagination
const page = req.query.page * 1 || 1;
// console.log(page)

const limit = req.query.limit * 1 || 10;
console.log(limit)

const skip = (page - 1) * limit; 
console.log('skip',skip)

query = query.skip(skip).limit(limit)

if(req.query.page){
  const docNum = await Tour.countDocuments();
  if(skip >= docNum) throw new Error('This page is not exist!')
}




  //Execute query
  const tours = await query;
  // const features = new APIFeatures(Tour.find(), req.query)
  //   .filter()
  //   .sort()
  //   .limitFields()
  //   .paginate();
  // const tours = await features.query;

  res.status(200).json({
    status: 'success',
    results: [`We have(${tours.length}) tours.`],
    data: {
      tours,
    },
  });
});

exports.getTourById = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
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
