const router = require('express').Router()
const {
  getMyGroups,
  createGroup,
  joinGroup,
  removeFromGroup,
} = require('../controllers/groupController')
const { auth } = require('../utils/middleware')

// all routes auth protected
router.use(auth)

// get all groups that current user is part of
router.get('/', getMyGroups)

// create a new group
router.post('/', createGroup)

// join a group
router.post('/join', joinGroup)

// leave a group
router.delete('/:user_id/:group_id', removeFromGroup)

// if admin, remove a user from a group
// removeFromGroup should be able to handle kicking users

module.exports = router
