const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'A user must have a name'],
    unique: true,
  },
  email: {
    type: String,
    require: [true, 'A user must have a email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valide email'],
  },
  password: {
    type: String,
    require: [true, 'A user must have a password'],
    minlength: 8,
  },
  passwordConfarmation: {
    type: String,
    require: [true, 'Plese input password confarmation'],
    //This validation fun only work with save mathode!
    validate: {
      validator: function (pwc) {
        return pwc === this.password;
      },
      message: 'Password is not match'
    },
  },
  photo: String,
});

userSchema.pre('save', async function(next){
if(!this.isModified('password')) return next();

this.password = await bcrypt.hash(this.password, 12);

this.passwordConfarmation = undefined;
})


const User = mongoose.model('User', userSchema);
module.exports = User;