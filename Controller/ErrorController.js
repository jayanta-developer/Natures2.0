const AppError = require('./../Utils/appError');



const handleCastErrorDB = (err) => {
  const message = `Invalid path: ${err.path} value: ${err.value}.`;
  return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
  const message = ` Duplicate field value:(${err.keyValue.name}) Plese use another value`;
  return new AppError(message, 400);
};
//Moongose validation Err
const handleValidationError = (err) => {
  const error = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${error.join('. ')}`;  
  return new AppError(message, 400);
};

//For Development Err
const sendErrDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    Error: err,
    message: err.message,
    stack: err.stack,
  });
};

//For producation Err
const sendErrPrd = (err, res) => {
  //Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    //Programing of other unknown error: don't leak error details
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

//Hendle Errors Form development and Producation
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.kind === 'ObjectId') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error._message === 'Validation failed' || 'Tour validation failed') error = handleValidationError(error);
    sendErrPrd(error, res);
  }
};