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
      ref: 'User',
      autopopulate: {
        select: 'name email',
        maxDepth: 1
      }
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        autopopulate: {
          select: 'name email',
          maxDepth: 1
        }
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
        autopopulate: { maxDepth: 1 }
      }
    ]
  },
  {
    timestamps: true
  }
)

groupSchema.plugin(require('mongoose-autopopulate'))
module.exports = mongoose.model('Group', groupSchema)