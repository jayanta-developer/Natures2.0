const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
// const Tour = require('../../Models/TourModels');
const Tour = require('../../Models/TourModels')

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => ('Database conacted successful!'))
  .catch(err => (err))

//read json file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours.json`, `utf-8`)
);

//import dada to database
const importData = async () => {
  try {
    await Tour.create(tours);
    ('Data successfully loaded!');
  } catch(err){
    (err)
  }
  process.exit();
};

//Delete all data from database
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    ('Data successfully deleted!');
  } catch (err) {
    ('this is the err',err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

(process.argv);
