const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/userModel')
const { isAlpha } = require('validator')

const getUser = async (request, response) => {
  const user = await User.findById(request.params.id, { password: 0 })
  if (!user) {
    return response.status(404).json({ error: 'user not found' })
  } else {
    return response.json(user)
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

    response.status(201).json({
      _id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      fullName: newUser.fullName,
      email: newUser.email,
      token: generateToken(newUser.id, rememberUser)
    })
  } catch (error) {
    response.status(400).json({ error: error.message })
  }
}

const loginUser = async (request, response) => {
  const { email, password, rememberUser } = request.body

  const user = await User.findOne({ email })
  if (user && (await bcrypt.compare(password, user.password))) {
    response.status(201).json({
      _id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      email: user.email,
      token: generateToken(user.id, rememberUser)
    })
  } else {
    response.status(400).json({
      error: 'Invalid credentials.'
    })
  }
}

const forgotPassword = async (request, response) => {
  const { email } = request.body

  const user = await User.findOne({ email })

  if (!user) {
    return response.status(404).json({ error: 'user not found' })
  }


}

const resetPassword = async () => {}

const generateToken = (id, rememberUser) => {
  return jwt.sign(
    { id },
    process.env.SECRET,
    { expiresIn: rememberUser ? '30d' : '1h' }
  )
}

module.exports = { registerUser, loginUser, getUser, forgotPassword, resetPassword }
