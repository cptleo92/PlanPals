const {
  AWS_BUCKET_NAME,
  AWS_BUCKET_REGION,
  AWS_S3_ACCESS_KEY,
  AWS_S3_SECRET_KEY
} = require('../utils/config')
const { nanoid } = require('nanoid')

const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')

const s3 = new S3Client({
  credentials: {
    accessKeyId: AWS_S3_ACCESS_KEY,
    secretAccessKey: AWS_S3_SECRET_KEY
  },
  region: AWS_BUCKET_REGION
})

const setAvatar = async (avatarBuffer, mimetype) => {
  let avatar = null

  if (avatarBuffer) {
    try {
      avatar = nanoid(32)

      const params = {
        Bucket: AWS_BUCKET_NAME,
        Key: avatar,
        Body: avatarBuffer,
        ContentType: mimetype
      }

      const command = new PutObjectCommand(params)

      await s3.send(command)

    } catch (error) {
      console.log(error)
    }
  }

  return avatar
}

const populateAvatar = async (modelType) => {
  if (modelType.avatar) {
    const params = {
      Bucket: AWS_BUCKET_NAME,
      Key: modelType.avatar
    }

    const command = new GetObjectCommand(params)
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 })
    modelType.avatar = url

    return url
  }
}

const deleteAvatar = (avatar) => {
  const params = {
    Bucket: AWS_BUCKET_NAME,
    Key: avatar
  }

  try {
    s3.send(new DeleteObjectCommand(params))

  } catch (error) {
    console.error(error)
  }
}

module.exports = {
  setAvatar,
  populateAvatar,
  deleteAvatar
}