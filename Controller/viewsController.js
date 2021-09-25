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
