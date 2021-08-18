const express = require('express');
const app = express();
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

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

//This is the rate limit function.
app.use(
  '/api',
  rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many request from that ip plese try again in a hour'
  })
);
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

//Middelwer
app.use((req, res, next) => {
  next();
});

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
