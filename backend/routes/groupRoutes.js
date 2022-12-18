const router = require('express').Router()
const {
  getMyGroups,
  createGroup,
  joinGroup,
  leaveGroup,
  kickFromGroup,
  updateGroup,
  getGroupByIDorPath,
  setGroupAvatar
} = require('../controllers/groupController')
const { auth } = require('../utils/middleware')
const multer = require('multer')

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// all routes auth protected
router.use(auth)

// get all groups that current user is part of
router.get('/', getMyGroups)

// get single group
// can query by _id or path
router.get('/:id', getGroupByIDorPath)

// kick from group
router.post('/kick', kickFromGroup)

// create a new group
router.post('/', createGroup)

// update a group
router.patch('/:id', updateGroup)

// join a group
router.post('/:id', joinGroup)

// leave a group
router.delete('/:id', leaveGroup)

router.post('/avatar', upload.single('avatar'), setGroupAvatar)

module.exports = router