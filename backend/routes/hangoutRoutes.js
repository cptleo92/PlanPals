const router = require('express').Router()
const {
  getMyHangouts,
  kickFromHangout,
  createHangout,
  joinHangout,
  leaveHangout,
  updateHangout,
  getHangoutByPath,
  updateHangoutDateVotes,
  deleteHangout,
  finalizeHangout
} = require('../controllers/hangoutController')
const { auth } = require('../utils/middleware')
const Hangout = require('../models/hangoutModel')

// multer config for photo uploading
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


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
router.post('/', upload.single('avatar'), createHangout)

// join a hangout
router.post('/:id', joinHangout)

// update a hangout
router.patch('/:id', upload.single('avatar'), updateHangout)

// add votes for a hangout's dateOptions
router.patch('/updatevotes/:id', updateHangoutDateVotes)

// finalize a date
router.patch('/finalize/:id', finalizeHangout)

// leave a hangout
router.delete('/:id', leaveHangout)

// delete a hangout
router.delete('/delete/:id', deleteHangout)


module.exports = router
