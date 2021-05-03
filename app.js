const express = require('express');
const morgan = require('morgan')
const app = express();

//Error handling constrictor
const AppError = require('./Utils/appError');
const globalErrorHandler = require('./Controller/ErrorController')

//Middleware
// console.log(process.env.NODE_ENV)
if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'));
}

app.use(express.json());
// app.use(express.static(`${_dirname}/public`));



// app.use((req, res, next) => {
//   console.log('hello from middleware.');
//   next();
// });

// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString();
//   next();
// });

//Define the routers
const TourRouter = require('./Routs/tourRouts');
const UserRouter = require('./Routs/userRouts');


// app.get("/", (req, res) => {
//   res.status(200).json({ Message: "Hello from server side!", App: "Nature" });
// });

// app.post("/", (req, res) => {
//   res.send("this is a post request..");
// });

// app.get('/api/v1/tours', getAllTour);
// app.post('/api/v1/tours', creatTour);
// app.get('/api/v1/tours/:id', getTourById);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

//Router Mounting
app.use('/api/v1/tours', TourRouter);
app.use('/api/v1/users', UserRouter);

app.all('*', (req, res, next) => {  
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
  });

//Here i define Operational error handling middleware function.
app.use(globalErrorHandler);

module.exports = app;
