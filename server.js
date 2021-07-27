//Start the server..
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');
const mongoose = require('mongoose');


const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Database is connected successfully!')).catch((err)=> console.log('somthing is wrong DB is not conocted', err))

//Run the server in port 2000
const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
