const mongoose = require('mongoose')

const hangoutSchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true
    },
    description: {
      type: String,
      trim: true,
      required: true
    },
    location: {
      type: String,
      trim: true,
    },
    dateOptions: [
      {
        type: String,
        required: true
      }
    ],
    planner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Group',
    },
    groupPath: {
      type: String,
      trim: true,
      required: true
    },
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
  },
  {
    timestamps: true
  }
)

hangoutSchema.plugin(require('mongoose-autopopulate'))
module.exports = mongoose.model('Hangout', hangoutSchema)