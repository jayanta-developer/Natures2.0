const Review = require('../Models/reviewModels');
const catchAsync = require('../Utils/catchAsync');
const fectory = require('./fectoryHandeler');

// check id for crect route
exports.setId = (req, res, next)=>{
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.author) req.body.author = req.user._id;
  next();
}
//Get all reviews
exports.getAllReview = fectory.getAllDoc(Review);
//Creact review
exports.createReview = fectory.createDos(Review)
//delete review by id
exports.deleteReview = fectory.deleteDos(Review);
//update reviews
exports.updateReview = fectory.updateDoc(Review);
//get review by id
exports.getReviewById = fectory.getOneDoc(Review);