const express = require('express');
const app = express();

//Middleware
app.use(express.json());

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
  // res.status(404).json({
  //     status: 'fail',
  //     message: `Can't find ${req.originalUrl} on this server.`
  // })
  const err = new Error(`Can't find ${req.originalUrl} on this server.`);
  err.status = 'fail';
  err.statusCode = 404;
  next(err);
});

//Here i define Operational error handling middleware function.
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });

  next()
});

module.exports = app;
