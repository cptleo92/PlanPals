const router = require('express').Router()
const { registerUser, loginUser, getUser } = require('../controllers/userController')

router.get('/:id', getUser)

router.post('/', registerUser)
router.post('/login', loginUser)


module.exports = router