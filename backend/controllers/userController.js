const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const User = require('../models/userModel')
const { isAlpha } = require('validator')
const sendEmail = require('../utils/email/sendEmail')
const { OAuth2Client } = require('google-auth-library')
const { GOOGLE_CLIENT_ID, JWT_SECRET } = require('../utils/config')
const { deleteAvatar, setAvatar, populateAvatar } = require('../utils/s3')

const getUser = async (request, response) => {
  const user = await User.findById(request.params.id, { password: 0 })
  if (!user) {
    return response.status(404).json({ error: 'user not found' })
  } else {
    return response.json(user)
  }
}

const getUserNotifications = async (request, response) => {
  const user = await User.findById(request.params.id)
  if (!user) {
    return response.status(404).json({ error: 'user not found' })
  } else {
    return response.json(user.notifications)
  }
}

const markNotificationsRead = async (request, response) => {
  const user = await User.findById(request.params.id)

  if (!user) {
    return response.status(404).json({ error: 'user not found' })
  } else {
    const notifications = request.body

    await User.findByIdAndUpdate(request.params.id, { notifications }, { new: true })

    return response.json(user.notifications)
  }
}

const registerUser = async (request, response) => {
  const { firstName, lastName, email, password, rememberUser } = request.body

  if (!firstName || !lastName || !email || !password) {
    return response.status(400).json({ error: 'All fields are required!' })
  }

  // don't allow numbers or special characters
  if (!isAlpha(firstName, 'en-US', { ignore: '-' })) {
    return response.status(400).json({ error: 'Name is invalid' })
  }

  if (!isAlpha(lastName, 'en-US', { ignore: '-' })) {
    return response.status(400).json({ error: 'Name is invalid' })
  }

  // password must be 6 chars
  if (password.length < 6) {
    return response.status(400).json({ error: 'Password must be at least 6 characters' })
  }

  // check for existing user
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return response.status(400).json({ error: 'User already exists!' })
  }

  // generate password hash
  const salt = await bcrypt.genSalt(10)
  const passwordHash = await bcrypt.hash(password, salt)

  let newUser = new User({
    firstName,
    lastName,
    email,
    password: passwordHash,
  })

  try {
    await newUser.save()

    newUser = await User.findOne({ email })

    await populateAvatar(newUser)

    response.status(201).json({
      _id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      fullName: newUser.fullName,
      email: newUser.email,
      token: generateToken(newUser.id, rememberUser),
      avatar: newUser.avatar
    })
  } catch (error) {
    response.status(400).json({ error: error.message })
  }
}

const loginUser = async (request, response) => {
  const { email, password, rememberUser } = request.body

  const user = await User.findOne({ email })
  if (user && (await bcrypt.compare(password, user.password))) {

    await populateAvatar(user)

    response.status(201).json({
      _id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      email: user.email,
      token: generateToken(user.id, rememberUser),
      avatar: user.avatar
    })
  } else {
    response.status(400).json({
      error: 'Invalid credentials.'
    })
  }
}

const loginOrCreateUserOauth = async (request, response) => {

  const client = new OAuth2Client(GOOGLE_CLIENT_ID)

  try {
    const ticket = await client.verifyIdToken({
      idToken: request.body.credential,
      audience: GOOGLE_CLIENT_ID,
    })

    const { email, family_name, given_name, sub } = ticket.getPayload()

    const user = await User.findOne({ email })

    if (user) {
      await populateAvatar(user)

      response.status(201).json({
        _id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        email: user.email,
        token: generateToken(user.id),
        avatar: user.avatar
      })
    } else {
      const salt = await bcrypt.genSalt(10)
      const password = await bcrypt.hash(sub, salt)

      let newUser = new User({
        firstName: given_name,
        lastName: family_name,
        email,
        password
      })

      await newUser.save()

      newUser = await User.findOne({ email })

      response.status(201).json({
        _id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        fullName: newUser.fullName,
        email: newUser.email,
        token: generateToken(newUser.id),
        avatar: newUser.avatar
      })

    }

  } catch (error) {
    console.error(error)
  }
}

const forgotPassword = async (request, response) => {
  const { email } = request.body

  const user = await User.findOne({ email })

  if (!user) {
    return response.status(404).json({ error: 'user not found' })
  }

  const resetPasswordToken = await user.getResetPasswordToken()

  user.save()

  const resetPasswordUrl = `https://${request.get('host')}/passwordReset/${resetPasswordToken}/${user.id}`

  try {
    sendEmail(
      user.email,
      'Reset Password Request',
      { firstName: user.firstName, resetPasswordUrl, },
      './template/requestResetPassword.handlebars')

    response.status(200).json({ success: 'true' })
  } catch (error) {
    console.error(error)
    response.status(500).json({ error })
  }

}

const resetPassword = async (request, response) => {
  const { token, id, password } = request.body

  const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex')

  const user = await User.findById(id)

  if (!user) {
    return response.status(404).json({ error: 'user not found' })
  }

  // confirm that tokens match and has not expired
  if (user.resetPasswordToken !== resetPasswordToken ||
    user.resetPasswordExpiry < Date.now()) {
    return response.status(401).json({ error: 'invalid reset token' })
  }

  try {
    // generate password hash
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    user.password = passwordHash
    user.resetPasswordToken = undefined
    user.resetPasswordExpiry = undefined

    await user.save()

    response.status(200).json({ success: 'true' })

  } catch (error) {
    console.error(error)
    response.status(500).json({ error })
  }

}

const generateToken = (id, rememberUser) => {
  return jwt.sign(
    { id },
    JWT_SECRET,
    { expiresIn: rememberUser ? '30d' : '1h' }
  )
}

const updateUser = async (request, response) => {
  // only user can edit own information
  if (request.user.id !== request.params.id) {
    return response.status(401).json({ error: 'unauthorized, please log in and try again' })
  }

  const userId = request.params.id
  const { firstName, lastName, fileChanged } = request.body
  const avatarBuffer = request.file?.buffer
  const mimetype = request.file?.mimetype

  let updateThisUser = await User.findById(userId)

  const previousAvatar = updateThisUser.avatar

  try {
    updateThisUser = await User.findByIdAndUpdate(userId, { firstName, lastName }, { new: true })

    if (request.file) {

      if (previousAvatar) deleteAvatar(previousAvatar)
      updateThisUser.avatar = await setAvatar(avatarBuffer, mimetype)

    } else if (fileChanged !== 'false' && previousAvatar) {

      // if group has an avatar but no file is attached, avatar will be deleted
      deleteAvatar(previousAvatar)
      updateThisUser.avatar = null

    }

    await updateThisUser.save()
    await populateAvatar(updateThisUser)

    response.status(200).json({
      _id: updateThisUser.id,
      firstName: updateThisUser.firstName,
      lastName: updateThisUser.lastName,
      fullName: updateThisUser.fullName,
      email: updateThisUser.email,
      token: generateToken(updateThisUser.id),
      avatar: updateThisUser.avatar
    })

  } catch (error) {
    response.status(400).json({ error: error.message })
  }
}

module.exports = {
  registerUser,
  loginUser,
  getUser,
  getUserNotifications,
  markNotificationsRead,
  forgotPassword,
  resetPassword,
  loginOrCreateUserOauth,
  updateUser
}
