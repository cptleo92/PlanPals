const mongoose = require('mongoose')
const config = require('../utils/config')
const logger = require('../utils/logger')

const connectDB = () => {
  try {
    mongoose.connect(config.MONGODB_URI)
    logger.info('connected to MongoDB')
  } catch(error) {
    logger.error('error connecting to MongoDB:', error.message)
  }
}
module.exports = connectDB