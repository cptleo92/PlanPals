const mongoose = require('mongoose')

const groupSchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true
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
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    // hangouts: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Hangout',
    //   }
    // ]
  },
  {
    timestamps: true
  }
)

// function autopopulateMembers(next) {
//   this.populate('members', {
//     name: 1,
//     email: 1
//   })
//   next()
// }

module.exports = mongoose.model('Group', groupSchema)