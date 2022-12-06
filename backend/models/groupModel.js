const mongoose = require('mongoose')

const groupSchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    path: {
      type: String,
      required: true
    },
    hangouts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hangout',
      }
    ]
  },
  {
    timestamps: true
  }
)

groupSchema.plugin(require('mongoose-autopopulate'))
module.exports = mongoose.model('Group', groupSchema)