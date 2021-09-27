const Tours = require('../Models/TourModels');

exports.overview = async (req, res) => {
  const tours = await Tours.find()  
  res.status(200).render('overview', {
    tours
  });
};

exports.tour = (req, res) => {
  res.status(200).render('tour', {
    title: 'Forest Hiker',
  });
};

exports.tourDetails = async (req, res)=>{
  const tour = await Tours.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review, rating, user'
  })
  console.log(tour)
  res.status(200).render('tour',{
    title: tour.name,
    tour
  })
}