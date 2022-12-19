const router = require('express').Router()
const {
  getMyGroups,
  createGroup,
  joinGroup,
  leaveGroup,
  kickFromGroup,
  updateGroup,
  getGroupByIDorPath,
} = require('../controllers/groupController')
const { auth } = require('../utils/middleware')

// multer config for photo uploading
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
router.post('/', upload.single('avatar'), createGroup)

// update a group
router.patch('/:id', upload.single('avatar'), updateGroup)

// join a group
router.post('/:id', joinGroup)

// leave a group
router.delete('/:id', leaveGroup)


module.exports = router