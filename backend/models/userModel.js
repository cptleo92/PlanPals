const mongoose = require('mongoose')
const { isEmail } = require('validator')

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      validate: [ isEmail, 'Invalid email format' ]
    },
    password: {
      type: String,
      required: true
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('User', userSchema)