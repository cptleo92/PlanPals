const router = require('express').Router()
const {
  getMyGroups,
  createGroup,
  joinGroup,
  removeFromGroup,
} = require('../controllers/groupController')
const { auth } = require('../utils/middleware')
const Group = require('../models/groupModel')

// all routes auth protected
router.use(auth)

// get all groups that current user is part of
router.get('/', getMyGroups)

// create a new group
router.post('/', createGroup)

// join a group
router.post('/:id', joinGroup)

// leave a group
router.delete('/:user_id/:group_id', removeFromGroup)

// if admin, remove a user from a group
// removeFromGroup should be able to handle kicking users

// remove this in prod
router.get('/all', async (request, response) => {
  const allGroups = await Group.find({}).populate('members', {
    name: 1,
    groups: 0
  })
  response.json(allGroups)
})

module.exports = router
