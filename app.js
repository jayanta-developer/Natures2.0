const express = require('express');
const app = express();
const morgan = require('morgan');

//Error handling constrictor
const AppError = require('./Utils/appError');
const globalErrorHandler = require('./Controller/ErrorController');

//Middleware
if (process.env.NODE_ENV === 'development') {
  console.log(process.env.NODE_ENV);
  app.use(morgan('dev'));
} else {
  console.log('production');
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

//Define the routers
const TourRouter = require('./Routs/tourRouts');
const UserRouter = require('./Routs/userRouts');

//Router Mounting
app.use('/api/v1/tours', TourRouter);
app.use('/api/v1/users', UserRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

//Here i define Operational error handling middleware function.
app.use(globalErrorHandler);

module.exports = app;
