const router = require('express').Router()
const User = require('../models/userModel')

router.post('/', async (request, response) => {
  const { name, email, password } = request.body

  const newUser = new User({ name, email, password })

  try {
    await newUser.save()
    response.status(201).json(newUser)
  } catch (error) {
    response.status(400).json({ error: error.message })
  }
})

router.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

router.get('/:id', async (request, response) => {
  const user = await User.findById(request.params.id)
  response.json(user)
})

module.exports = router