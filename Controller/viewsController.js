
exports.overview = (req, res) => {
  res.status(200).render('overview', {
    title: 'Tours overview',
  });
};

exports.tour = (req, res) => {
  res.status(200).render('tour', {
    title: 'Forest Hiker',
  });
};
