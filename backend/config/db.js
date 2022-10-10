const mongoose = require('mongoose')
const config = require('../utils/config')
const logger = require('../utils/logger')

logger.info('connecting to', config.MONGODB_URI)

const connectDB = async () => {
  await mongoose.connect(config.MONGODB_URI)
    .then(() => {
      logger.info('connected to MongoDB')
    })
    .catch((error) => {
      logger.error('error connecting to MongoDB:', error.message)
    })
}
module.exports = connectDB