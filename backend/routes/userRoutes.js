const router = require('express').Router()
const { registerUser, loginUser } = require('../controllers/userController')
const User = require('../models/userModel')

router.post('/', registerUser)
router.post('/login', loginUser)

router.get('/', async (request, response) => {
  const allUsers = await User.find({})
  response.json(allUsers)
})


module.exports = router