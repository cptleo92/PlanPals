const mongoose = require('mongoose')
const crypto = require('crypto')
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
    ],
    resetPasswordToken: String,
    resetPasswordExpiry: Date,
    notifications: [
      {
        type: Map,
        of: String
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

userSchema.methods.getResetPasswordToken = async function() {

  const resetToken = crypto.randomBytes(20).toString('hex')

  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
  this.resetPasswordExpiry = Date.now() + 15 * 60 * 1000

  return resetToken
}

userSchema.plugin(require('mongoose-autopopulate'))

module.exports = mongoose.model('User', userSchema)