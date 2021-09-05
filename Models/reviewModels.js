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
      required: [true, 'Plese give a rating'],
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

reviewShema.pre(/^find/, function (next) {
  this.populate({
    path: 'author',
    select: 'name photo',
  });
  next();
});

reviewShema.static.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sun: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  console.log(stats)
};

reviewShema.post('save', function() {
  this.constructor.calcAverageRatings(this.tour)
})

const Review = mongoose.model('Review', reviewShema);
module.exports = Review;
