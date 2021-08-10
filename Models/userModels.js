const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'A user must have a email'],
    validate: [validator.isEmail, 'Please provide a valide email'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'A user must have a password'],
    minlength: 8,
    select: false,
  },
  passwordConfarmation: {
    type: String,
    required: [true, 'Plese input password confarmation'],
    //This validation fun only work with save mathode!
    validate: {
      validator: function (pwc) {
        return this.password === pwc;
      },
      message: 'Password is not match',
    },
  },
  photo: String,

  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
  //   this.passwordConfarmation = undefined;
};

userSchema.methods.AfterchangesPassword = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changeTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changeTimeStamp;
  }
  return false;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
