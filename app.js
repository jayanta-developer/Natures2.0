const express = require('express');
const helmet = require('helmet');
const app = express();
const path = require('path');
const morgan = require('morgan');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

//Error handling constrictor
const AppError = require('./Utils/appError');
const globalErrorHandler = require('./Controller/ErrorController');

//set security HTTP headers
app.use(helmet());

//Middleware Production logo
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
    message: 'Too many request from that ip please try again in a hour',
  })
);
//Body parser. reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

//Data sanitize for NoSQL quire
app.use(mongoSanitize());

//Data sanitize for xss
app.use(xss());
// HTTP paramitar poliotion
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingAverage',
      'ratingQuantity',
      'maxGroupSize',
      'medium',
      'price',
    ],
  })
);

//view engen pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//Serving the static the files
app.use(express.static(path.join(__dirname, 'public')));

//Middelwer
app.use((req, res, next) => {
  next();
});

//Define the routers
const TourRouter = require('./Routs/tourRouts');
const UserRouter = require('./Routs/userRouts');
const ReviewRouter = require('./Routs/reviewRoutes');
const ViewRouter = require('./Routs/viewsRouter')
//Router Mounting
app.use('/api/v1/tours', TourRouter);
app.use('/api/v1/users', UserRouter);
app.use('/api/v1/review', ReviewRouter);
app.use('/', ViewRouter)

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

//Here i define Operational error handling middleware function.
app.use(globalErrorHandler);

module.exports = app;
