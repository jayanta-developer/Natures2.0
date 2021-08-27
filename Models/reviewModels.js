const mongoose = require('mongoose');
// const Tour = require('./TourModels');

const reviewShema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Rating can't be empty"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },

    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },

    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// reviewShema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'tour',
//     select:
//       '-id -guides -startLocation -ratingAverage -ratingQuantity -images -secretTour -startDates -duration -maxGroupSize -price -summary -description -imageCover -location -__v -difficulty -durationWeek',
//   }).populate({
//     path: 'author',
//     select: 'name photo',
//   });
//   next();
// });

reviewShema.pre(/^find/, function(next){
  this.populate({
    path: 'author',
    select: 'name photo'
  });
  next();
})

const Review = mongoose.model('Review', reviewShema);
module.exports = Review;
