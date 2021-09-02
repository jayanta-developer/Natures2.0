const catchAsync = require('../Utils/catchAsync');
const AppError = require('../Utils/appError');
const APIFeatures = require('./../Utils/apiFeatures');
const { model } = require('mongoose');

exports.deleteDos = (model) =>
  catchAsync(async (req, res, next) => {
    const docs = await model.findByIdAndDelete(req.params.id);

    if (!docs) {
      return next(
        new AppError(`No document found with that ID ${req.params.id}`, 404)
      );
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.createDos = (model) =>
  catchAsync(async (req, res, next) => {
    const doc = await model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.updateDoc = (model) =>
  catchAsync(async (req, res, next) => {
    const doc = await model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

exports.getOneDoc = (model, populateOption) =>
  catchAsync(async (req, res, next) => {
    let quire = model.findById(req.params.id);
    if (populateOption) quire = quire.populate(populateOption);

    const doc = await quire;
    if (!doc) {
      return next(
        new AppError(`No document found with that ID ${req.params.id}`, 404)
      );
    }
    res.status(200).json({
      status: 'success',
      data: {
        date: doc,
      },
    });
  });

exports.getAllDoc = (model) =>
  catchAsync(async (req, res, next) => {
    //check for nested tour routed in review
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query;

    res.status(200).json({
      status: 'success',
      results: [`We have(${doc.length}) tours.`],
      data: {
        data: doc,
      },
    });
  });
