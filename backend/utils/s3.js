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

const populateAvatar = async (group) => {
  if (group.avatar) {
    const params = {
      Bucket: AWS_BUCKET_NAME,
      Key: group.avatar
    }

    const command = new GetObjectCommand(params)
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 })
    group.avatar = url
  }
}

const deleteAvatar = (avatar) => {
  const params = {
    Bucket: AWS_BUCKET_NAME,
    Key: avatar
  }

  s3.send(new DeleteObjectCommand(params))

}

module.exports = {
  setAvatar,
  populateAvatar,
  deleteAvatar
}