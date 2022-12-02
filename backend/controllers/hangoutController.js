const Hangout = require('../models/hangoutModel')
const Group = require('../models/groupModel')
const User = require('../models/userModel')

const getMyHangouts = async (request, response) => {
  const currentUser = await User.findById(request.user.id)
  response.json(currentUser.hangouts)
}

const kickFromHangout = async (request, response) => {}

const createHangout = async (request, response) => {
  const { title, description, location, dateOptions, groupPath } = request.body

  if (!title || !description || dateOptions.length === 0) {
    return response.status(400).json({ error: 'All fields are required!' })
  }

  const currentUser = await User.findById(request.user.id)
  const group = await Group.findOne({ path: groupPath })

  const newHangout = new Hangout({
    title,
    description,
    location,
    planner: currentUser.id,
    group: group.id,
    groupPath,
    dateOptions,
    attendees: [currentUser.id],
  })

  try {
    await newHangout.save()

    currentUser.hangouts.push(newHangout.id)
    await currentUser.save()

    group.hangouts.push(newHangout.id)
    await group.save()

    response.status(201).json({
      _id: newHangout.id,
      title: newHangout.title,
      description: newHangout.description,
      planner: currentUser.id,
      group: group.id,
      groupPath: group.groupPath,
      dateOptions: newHangout.dateOptions,
      attendees: newHangout.attendees
    })

  } catch (error) {
    response.status(400).json({ error: error.message })
  }
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