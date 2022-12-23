const router = require('express').Router()
const { registerUser, loginUser, getUser, forgotPassword, resetPassword } = require('../controllers/userController')

router.get('/:id', getUser)

router.post('/', registerUser)
router.post('/login', loginUser)

router.post('/password/forgot', forgotPassword)
router.post('/password/reset/:token', resetPassword)


module.exports = router