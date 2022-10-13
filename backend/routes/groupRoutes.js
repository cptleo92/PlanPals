const router = require('express').Router()
const {
  getMyGroups,
  createGroup,
  joinGroup,
  leaveGroup,
  kickFromGroup
} = require('../controllers/groupController')
const { auth } = require('../utils/middleware')
const Group = require('../models/groupModel')

// remove this in prod
// router.get('/all', async (request, response) => {
//   const allGroups = await Group.find({})
//   response.json(allGroups)
// })
// all routes auth protected
router.use(auth)

// get all groups that current user is part of
router.get('/', getMyGroups)

// kick from group
router.post('/kick', kickFromGroup)

router.get('/:id', async (request, response) => {
  const group = await Group.findById(request.params.id)
  response.json(group)
})

// create a new group
router.post('/', createGroup)

// join a group
router.post('/:id', joinGroup)

// leave a group
router.delete('/:id', leaveGroup)


module.exports = router
