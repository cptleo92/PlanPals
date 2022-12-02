const Hangout = require('../models/hangoutModel')
const User = require('../models/userModel')

const getMyHangouts = async (request, response) => {
  const currentUser = await User.findById(request.user.id)
  response.json(currentUser.hangouts)
}

const kickFromHangout = async (request, response) => {}

const createHangout = async (request, response) => {
  const { title, description, location, dateOptions } = request.body

  if (!title || !description) {
    return response.status(400).json({ error: 'All fields are required!' })
  }

  const currentUser = await User.findById(request.user.id)

  const newHangout = new Hangout({
    title,
    description,
    location,
    planner: currentUser.id,
    // group: ,
    dateOptions,
    attendees: [currentUser.id],
  })
}

const joinHangout = async (request, response) => {}

const leaveHangout = async (request, response) => {}


module.exports = {
  getMyHangouts,
  kickFromHangout,
  createHangout,
  joinHangout,
  leaveHangout
}