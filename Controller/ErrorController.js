const AppError = require('./../Utils/appError')

const handleCastErrorDB = err =>{
  const message = `Invalid ${err.path}: ${err.value}.`
  return new AppError(message, 400);
}

const sendErrDev = (err, res) => {  
  res.status(err.statusCode).json({
    status: err.status,    
    Error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrPrd = (err, res) => {
  //Operational, trusted error: send message to client
  if(err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    //Programing of other unknown error: don't leak error details
  }else {
    //1) Log error
    // console.error('ERROR', err)    
    res.status(500).json({
      status:'error',
      message: 'Something went very wrong!'
    })
  }
};



module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

if(error.name === 'CastError') error = handleCastErrorDB(error);

    sendErrPrd(error, res);
  }
  
}; 
