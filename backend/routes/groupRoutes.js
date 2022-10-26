const router = require('express').Router()
const {
  getMyGroups,
  createGroup,
  joinGroup,
  leaveGroup,
  kickFromGroup,
  getGroupByIDorPath
} = require('../controllers/groupController')
const { auth } = require('../utils/middleware')

// remove this in prod
// router.get('/all', async (request, response) => {
//   const allGroups = await Group.find({})
//   response.json(allGroups)
// })
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

// join a group
router.post('/:id', joinGroup)

// leave a group
router.delete('/:id', leaveGroup)


module.exports = router

// "eXKZDe"