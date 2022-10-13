const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/userModel')
const { isAlpha } = require('validator')

const registerUser = async (request, response) => {
  const { name, email, password } = request.body

  if (!name || !email || !password) {
    return response.status(400).json({ error: 'All fields are required!' })
  }

  // don't allow numbers or special characters
  if (!isAlpha(name, 'en-US', { ignore: ' -' })) {
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

  const newUser = new User({
    name,
    email,
    password: passwordHash,
  })

  try {
    await newUser.save()
    response.status(201).json({
      _id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      token: generateToken(newUser.id)
    })
  } catch (error) {
    response.status(400).json({ error: error.message })
  }
}

const loginUser = async (request, response) => {
  const { email, password } = request.body

  const user = await User.findOne({ email })
  if (user && (await bcrypt.compare(password, user.password))) {
    response.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id)
    })
  } else {
    response.status(400).json({
      error: 'Invalid credentials'
    })
  }
}

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.SECRET,
    { expiresIn: '60d' }
  )
}

module.exports = { registerUser, loginUser }
