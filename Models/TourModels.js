const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name!'],
      unique: [true, 'This tour already exist!'],
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
    },
    ratingAverage: {
      type: Number,
      default: 4.7,
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price!'],
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have cover photo'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
    startDates: [Date],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//Virtual Properties, This is show the aditional fild after get the data/ not save in DB
tourSchema.virtual('durationWeek').get(function () {
  return this.duration / 7;
});


//Doucament Middelwear.
// this is run before seve() creact() funcation.
tourSchema.pre('save', function (next) {
  console.log('this is run before seve the data in DB');
  next();
});


//Query Middelwear.

tourSchema.pre(/^find/, function (next) {
  //This kaind of find expreson use for all find mathode
  this.findOne({ secretTour: { $ne: true } })
  next();
});

//Aggregation Middelwear
tourSchema.pre('aggregate', function(next){
  this.pipeline().unshift({ '$match': {secretTour: { $ne: true }}});
  next()
})



const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
