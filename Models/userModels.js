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
    select: true,
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
};

const User = mongoose.model('User', userSchema);
module.exports = User;
