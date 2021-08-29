const catchAsync = require('../Utils/catchAsync');
const AppError = require('../Utils/appError');

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
 