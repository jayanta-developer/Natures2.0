const { Mongoose } = require('mongoose');
const Tour = require('./TourModels');

const reviewShema = new Mongoose.Schema(
  {
    //review test/  createdAt /./ tour name // user name

    review: {
      type: String,
      required: [true, "Rating can't be empty"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: Date.now(),
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to tour'],
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
    path: 'tour',
  });
  next();
});

const Review = mongoose.model('Review', reviewShema);

module.exports = Review;
