const router = require('express').Router()
const {
  getMyHangouts,
  kickFromHangout,
  createHangout,
  joinHangout,
  leaveHangout,
  updateHangout,
  getHangoutByPath,
  updateHangoutDateVotes
} = require('../controllers/hangoutController')
const { auth } = require('../utils/middleware')
const Hangout = require('../models/hangoutModel')

// remove this in prod
router.get('/all', async (request, response) => {
  const allHangouts = await Hangout.find({})
  response.json(allHangouts)
})
// all routes auth protected
router.use(auth)

// get all hangouts that current user is part of
router.get('/', getMyHangouts)

// get hangout with matching path
router.get('/:path', getHangoutByPath)

// kick from hangout
router.post('/kick', kickFromHangout)

router.get('/:id', async (request, response) => {
  const hangout = await Hangout.findById(request.params.id)
  response.json(hangout)
})

// create a new hangout
router.post('/', createHangout)

// update a hangout
router.post('/update', updateHangout)


// join a hangout
router.post('/:id', joinHangout)

// add votes for a hangout's dateOptions
router.post('/:id/updatevotes', updateHangoutDateVotes)

// leave a hangout
router.delete('/:id', leaveHangout)


module.exports = router
