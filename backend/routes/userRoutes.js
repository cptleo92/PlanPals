const router = require('express').Router()
const { registerUser, loginUser, getUser } = require('../controllers/userController')
const User = require('../models/userModel')

router.get('/:id', getUser)

router.post('/', registerUser)
router.post('/login', loginUser)

// remove this in prod
router.get('/', async (request, response) => {
  const allUsers = await User.find({})
  response.json(allUsers)
})


module.exports = router