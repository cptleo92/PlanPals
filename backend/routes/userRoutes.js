const router = require('express').Router()
const { registerUser,
  loginUser,
  getUser,
  getUserNotifications,
  markNotificationsRead,
  forgotPassword,
  resetPassword,
  loginOrCreateUserOauth } = require('../controllers/userController')

router.get('/:id', getUser)
router.get('/:id/notifs', getUserNotifications)
router.patch('/:id/notifs', markNotificationsRead)

router.post('/', registerUser)
router.post('/login', loginUser)
router.post('/oauth2', loginOrCreateUserOauth)

router.post('/password/forgot', forgotPassword)
router.post('/password/reset', resetPassword)


module.exports = router