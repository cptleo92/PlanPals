const router = require('express').Router()
const User = require('../models/userModel')
const { registerUser, loginUser } = require('../controllers/userController')

router.post('/', registerUser)
router.post('/login', loginUser)

router.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

router.get('/:id', async (request, response) => {
  const user = await User.findById(request.params.id)
  response.json(user)
})

module.exports = router