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
    groups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        autopopulate: {
          maxDepth: 1
        }
      }
    ],
    hangouts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hangout',
        autopopulate: {
          maxDepth: 1
        }
      }
    ]
  },
  {
    timestamps: true,
  }
)

userSchema.plugin(require('mongoose-autopopulate'))

module.exports = mongoose.model('User', userSchema)