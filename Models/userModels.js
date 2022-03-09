const crypto = require('crypto');
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
  passwordChangedAt: {
    type: Date,
    select: false,
  },

  role: {
    type: String,
    default: 'user',
    enum: {
      values: ['user', 'guide', 'admin', 'lead-guide'],
      message: 'A user role must be in betwen (user, guide, lead-guide, admin)',
    },
  },
  passwordResetToken: String,
  passwordTokenExpires: Date,

  Active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfarmation = undefined;
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
});

userSchema.pre(/^find/, function (next) {
  this.find({ Active: { $ne: false } });
  next();
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
    const changeTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changeTimeStamp;
  }
  return false;
};

userSchema.methods.CreateResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // ({resetToken}, this.passwordResetToken);

  this.passwordTokenExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
