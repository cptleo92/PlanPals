const Hangout = require('../models/hangoutModel')
const Group = require('../models/groupModel')
const User = require('../models/userModel')
const { nanoid } = require('nanoid')
const { populateAvatar, setAvatar, deleteAvatar } = require('../utils/s3')

const getMyHangouts = async (request, response) => {
  const currentUser = await User.findById(request.user.id)

  const userHangouts = currentUser.hangouts

  for (let hout of userHangouts) {
    await populateAvatar(hout)
  }

  response.json(userHangouts)
}

const getHangoutByPath = async (request, response) => {
  const { path } = request.params
  try {
    const hangout = await Hangout.findOne({ path })

    await populateAvatar(hangout)

    response.json(hangout)
  } catch (error) {
    response.status(404).json({ error: 'Hangout not found' })
  }
}

const createHangout = async (request, response) => {
  let { title, description, location, dateOptions, groupPath } = request.body
  const avatarBuffer = request.file?.buffer
  const mimetype = request.file?.mimetype
  let avatar = await setAvatar(avatarBuffer, mimetype)

  dateOptions = JSON.parse(dateOptions)

  if (!title || !description || Object.keys(dateOptions).length === 0) {
    return response.status(400).json({ error: 'All fields are required!' })
  }

  const currentUser = await User.findById(request.user.id)
  const group = await Group.findOne({ path: groupPath })

  const finalized = Object.keys(dateOptions).length === 1
  const finalDate = finalized ? new Date(Object.keys(dateOptions)[0]) : null

  const newHangout = new Hangout({
    title,
    description,
    location,
    planner: currentUser.id,
    group: group.id,
    groupPath,
    dateOptions,
    attendees: [],
    path: nanoid(6),
    finalized,
    finalDate,
    avatar
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
      groupPath: group.path,
      dateOptions: newHangout.dateOptions,
      attendees: newHangout.attendees,
      path: newHangout.path,
      finalDate: newHangout.finalDate,
      avatar: newHangout.avatar
    })


  } catch (error) {
    console.error(error)
    response.status(400).json({ error: error.message })
  }
}

const joinHangout = async (request, response) => {
  const hangoutId = request.params.id
  const dateVotes = request.body

  const currentUser = await User.findById(request.user.id)
  const hangoutToJoin = await Hangout.findById(hangoutId)

  // don't let user join without specifying dates
  if (!dateVotes || dateVotes.length === 0) {
    return response
      .status(400)
      .json({ error: 'At least 1 date must be chosen' })
  }

  // don't let user join twice, or admin join again
  const alreadyJoined = () => {
    let userHangouts = currentUser.hangouts.map((hangout) => hangout.id)
    let hangoutAttendees = hangoutToJoin.attendees.map((mem) => mem.toString())
    let isPlanner = hangoutToJoin.planner.toString() === request.user.id

    return (
      userHangouts.includes(hangoutId) ||
      hangoutAttendees.includes(currentUser.id) ||
      isPlanner
    )
  }

  if (alreadyJoined()) {
    return response
      .status(400)
      .json({ error: 'You are already attending this hangout' })
  }

  try {
    currentUser.hangouts.push(hangoutId)
    await currentUser.save()

    hangoutToJoin.attendees.push(currentUser.id)

    // update votes in dateOptions
    for (let vote of dateVotes) {
      hangoutToJoin.dateOptions.get(vote).push(currentUser.id)
    }

    await hangoutToJoin.save()

    response.status(200).json(hangoutToJoin)
  } catch (error) {
    response.status(400).json({ error: error.message })
  }
}

const leaveHangout = async (request, response) => {
  // error if hangout is invalid
  const hangout = await Hangout.findById(request.params.id)

  if (!hangout) {
    return response.status(404).json({ error: 'hangout not found' })
  }

  const currentUser = await User.findById(request.user.id)

  // user can't leave if user isn't attending in the first place

  let userHangouts = currentUser.hangouts.map(hout => hout.id)
  let hangoutAttendees = hangout.attendees.map(att => att.id)

  if (
    !userHangouts.includes(hangout.id) ||
    !hangoutAttendees.includes(currentUser.id)
  ) {
    return response.status(400).json({ error: 'You are already not attending' })
  }

  try {
    // remove hangout from user's hangouts
    currentUser.hangouts = currentUser.hangouts.filter((usersHangout) => {
      return usersHangout.id !== hangout.id
    })

    await currentUser.save()

    // remove user from hangout attendees
    hangout.attendees = hangout.attendees.filter((attendee) => {
      return attendee.id !== currentUser.id
    })

    // remove user votes from hangout.dateOptions
    for (let [date, votes] of hangout.dateOptions) {
      votes = votes.filter(vote => vote !== currentUser.id)
      hangout.dateOptions.set(date, votes)
    }

    await hangout.save()

    response.sendStatus(204)
  } catch (error) {
    response.status(400).json({ error: error.message })
  }
}

const kickFromHangout = async (request, response) => {
  const { userId, hangoutId } = request.body

  const kickThisUser = await User.findById(userId)
  const kickFromHangout = await Hangout.findById(hangoutId)

  // only planner can kick
  if (request.user.id !== kickFromHangout.planner.id) {
    return response.status(401).json({
      error: 'only planner can remove a user from the hangout'
    })
  }

  try {
    kickThisUser.hangouts = kickThisUser.hangouts.filter(hangout => hangout.id !== hangoutId)
    await kickThisUser.save()

    kickFromHangout.attendees = kickFromHangout.attendees.filter(attendee => attendee.id !== userId)

    // remove user votes from hangout.dateOptions
    for (let [date, votes] of kickFromHangout.dateOptions) {
      votes = votes.filter(vote => vote !== kickThisUser.id)
      kickFromHangout.dateOptions.set(date, votes)
    }

    await kickFromHangout.save()

    response.sendStatus(204)
  } catch (error) {
    response.status(400).json({ error: error.message })
  }
}

const updateHangout = async (request, response) => {
  const hangoutId = request.params.id
  const newHangoutData = request.body
  const avatarBuffer = request.file?.buffer
  const mimetype = request.file?.mimetype

  let updateThisHangout = await Hangout.findById(hangoutId)

  // only hangout planner can update
  if (request.user.id !== updateThisHangout.planner.id) {
    return response.status(401).json({ error: 'only planner can update the hangout' })
  }

  try {
    // delete the old avatar if applicable
    if (updateThisHangout.avatar) {
      deleteAvatar(updateThisHangout.avatar)
    }

    updateThisHangout = await Hangout.findByIdAndUpdate(hangoutId, newHangoutData, { new: true })

    updateThisHangout.avatar = await setAvatar(avatarBuffer, mimetype)
    await updateThisHangout.save()

    response.status(200).json(updateThisHangout)
  } catch (error) {
    response.status(400).json({ error: error.message })
  }
}

const updateHangoutDateVotes = async (request, response) => {

  const dateVotes = request.body // dates = [date strings]

  const currentUser = await User.findById(request.user.id)
  const hangout = await Hangout.findById(request.params.id)

  // error if dateVotes is invalid
  if (dateVotes.length === 0) {
    return response.status(400).json({ error: 'At least 1 date is required' })
  }

  // error if user isn't attending
  let userHangouts = currentUser.hangouts.map(hout => hout.id)
  let hangoutAttendees = hangout.attendees.map(att => att.id)

  if (
    !userHangouts.includes(hangout.id) ||
    !hangoutAttendees.includes(currentUser.id)
  ) {
    return response.status(400).json({ error: 'You are not attending' })
  }

  try {
    for (let [date, votes] of hangout.dateOptions) {
    // if date is not in dateVotes, filter user out
    // otherwise, push user (unless user is already in there)

      if (!dateVotes.includes(date)) {
        votes = votes.filter(id => id !== currentUser.id)
      } else if (!votes.includes(currentUser.id)) {
        votes.push(currentUser.id)
      }

      hangout.dateOptions.set(date, votes)
    }

    await hangout.save()
    response.status(200).json(hangout)

  } catch (error) {
    response.status(400).json({ error: error.message })
  }

}

const deleteHangout = async (request, response) => {
  const hangoutId = request.params.id
  const userId = request.user.id

  const deleteThisHangout = await Hangout.findById(hangoutId)

  // only planner can delete hangout
  if (userId !== deleteThisHangout.planner.id) {
    return response.status(401).json({ error: 'only planner can delete the hangout' })
  }

  // can't delete if people are attending
  if (deleteThisHangout.attendees.length > 0) {
    return response.status(401).json({ error: 'cannot delete if there are attendees' })
  }

  try {
    await Group.findOneAndUpdate({ id: deleteThisHangout.group }, {
      $pull: {
        'hangouts': hangoutId
      }
    })

    await User.findOneAndUpdate({ id: userId }, {
      $pull: {
        'hangouts': hangoutId
      }
    })

    await deleteThisHangout.remove()

    response.sendStatus(204)
  } catch (error) {
    response.status(400).json({ error: error.message })
  }
}

const finalizeHangout = async (request, response) => {
  const hangoutId = request.params.id
  const userId = request.user.id
  const { finalDate } = request.body

  const hangout = await Hangout.findById(hangoutId)

  // only planner can finalize
  if (userId !== hangout.planner.id) {
    return response.status(401).json({ error: 'only planner can delete the hangout' })
  }

  // final date must be one of the options
  const dates = Array.from(hangout.dateOptions.keys())

  if (!dates.includes(finalDate)) {
    return response.status(401).json({ error: 'invalid date' })
  }

  try {
    hangout.finalized = true
    hangout.finalDate = new Date(finalDate)

    await hangout.save()

    response.status(200).json(hangout)
  } catch (error) {
    response.status(400).json({ error: error.message })
  }
}

module.exports = {
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
}