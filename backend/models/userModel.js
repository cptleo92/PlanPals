const mongoose = require('mongoose')
const { isEmail } = require('validator')

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      trim: true,
      required: [true, 'Email is required'],
      unique: true,
      validate: [ isEmail, 'Invalid email format' ]
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: 6
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('User', userSchema)