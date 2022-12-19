require('dotenv').config()

const PORT = process.env.PORT

let MONGODB_URI
if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.TEST_MONGODB_URI
} else if (process.env.NODE_ENV === 'development') {
  MONGODB_URI = process.env.DEV_MONGODB_URI
} else {
  MONGODB_URI = process.env.MONGODB_URI
}

const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME
const AWS_BUCKET_REGION = process.env.AWS_BUCKET_REGION
const AWS_S3_ACCESS_KEY = process.env.AWS_S3_ACCESS_KEY
const AWS_S3_SECRET_KEY = process.env.AWS_S3_SECRET_KEY

module.exports = {
  MONGODB_URI,
  PORT,
  AWS_BUCKET_NAME,
  AWS_BUCKET_REGION,
  AWS_S3_ACCESS_KEY,
  AWS_S3_SECRET_KEY
}