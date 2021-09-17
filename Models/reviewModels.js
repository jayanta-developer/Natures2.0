const mongoose = require('mongoose');
const Tour = require('./TourModels');

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

reviewShema.index({ tour: 1, user: 1 }, { unique: true });

reviewShema.pre(/^find/, function (next) {
  this.populate({
    path: 'author',
    select: 'name photo',
  });
  next();
});

//calculat reting avarage when crate a review
reviewShema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingQuantity: stats[0].nRating,
      ratingAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingQuantity: 0,
      ratingAverage: 4.5,
    });
  }
};

reviewShema.post('save', function () {
  this.constructor.calcAverageRatings(this.tour);
});

//Update and delete
reviewShema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  console.log(this.r);
  next();
});
reviewShema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewShema);
module.exports = Review;
