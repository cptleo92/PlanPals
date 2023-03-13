const Group = require('../models/groupModel')
const User = require('../models/userModel')
const Hangout = require('../models/hangoutModel')

const mongoose = require('mongoose')
const config = require('../utils/config')
const logger = require('../utils/logger')


try {
  mongoose.connect(config.MONGODB_URI)
  logger.info('connected to MongoDB')
} catch (error) {
  logger.error('error connecting to MongoDB:', error.message)
}

const wipeDb = async () => {
  if (process.env.NODE_ENV === 'production') return

  await User.deleteMany()
  await Group.deleteMany()
  await Hangout.deleteMany()
}

wipeDb().then(() => mongoose.connection.close())
