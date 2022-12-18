require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

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