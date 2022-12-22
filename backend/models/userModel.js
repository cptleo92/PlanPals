const mongoose = require('mongoose')
const { isEmail } = require('validator')

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
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

userSchema.virtual('fullName').get(function() {
  return this.firstName + ' ' + this.lastName
})

// properly capitalizes firstName and lastName
userSchema.pre('save', function (next) {
  this.firstName = this.firstName.charAt(0).toUpperCase() + this.firstName.slice(1)
  this.lastName = this.lastName.charAt(0).toUpperCase() + this.lastName.slice(1)
  next()
})

userSchema.plugin(require('mongoose-autopopulate'))

module.exports = mongoose.model('User', userSchema)