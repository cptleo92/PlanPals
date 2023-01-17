const router = require('express').Router()
const { registerUser,
  loginUser,
  getUser,
  getUserNotifications,
  markNotificationsRead,
  forgotPassword,
  resetPassword,
  loginOrCreateUserOauth,
  updateUser
} = require('../controllers/userController')
const { auth } = require('../utils/middleware')

// multer config for photo uploading
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.get('/:id', getUser)
router.get('/:id/notifs', getUserNotifications)
router.patch('/:id/notifs', markNotificationsRead)

router.post('/', registerUser)
router.post('/login', loginUser)
router.post('/oauth2', loginOrCreateUserOauth)

router.post('/password/forgot', forgotPassword)
router.post('/password/reset', resetPassword)

router.use(auth)
router.patch('/:id', upload.single('avatar'), updateUser )

module.exports = router