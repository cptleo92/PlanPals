const Group = require('../models/groupModel')
const User = require('../models/userModel')
const Hangout = require('../models/hangoutModel')
const {
  getRandomModel,
  getRandomTitle
} = require('./seedHelper')

const { faker } = require('@faker-js/faker')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const config = require('../utils/config')
const logger = require('../utils/logger')
const { nanoid } = require('nanoid')
const { sendNewHangoutNotification, sendNewMemberNotification, sendNewAttendeeNotification } = require('../utils/notifications')

const USERSCOUNT = 10
const GROUPSCOUNT = (USERSCOUNT / 2)
const HANGOUTSCOUNT = (USERSCOUNT * 2)
const MEMBERSHIPSCOUNT = (USERSCOUNT * 5)
const ATTENDANCESCOUNT = (USERSCOUNT * 10)

/**
 * creates and saves a new user
 */
const createSeedUser = async (i) => {
  const firstName = faker.name.firstName()
  const lastName = faker.name.lastName()

  // if arg is provided, generate test email
  // makes it easier to log in to any group admin's account
  const email = i
    ? `test${i}@test.com`
    : faker.internet.email(firstName, lastName)

  // generate password hash
  const salt = await bcrypt.genSalt(10)
  const password = await bcrypt.hash('password', salt)

  const newUser = new User({
    firstName,
    lastName,
    email,
    password,
  })

  await newUser.save()
}

/**
 * creates and saves a new group
 */
const createSeedGroup = async (i) => {
  const allUsers = await User.find()

  const randomAdmin = allUsers[i]

  const newGroup = new Group({
    title: getRandomTitle('group'),
    description: faker.lorem.paragraph(),
    admin: randomAdmin.id,
    members: [],
    hangouts: [],
    path: nanoid(6),
  })

  await newGroup.save()

  randomAdmin.groups.push(newGroup.id)
  await randomAdmin.save()
}

/**
 * creates and saves a new hangout
 *
 */
const createSeedHangout = async () => {
  const randomGroup = await getRandomModel('group')

  // picks out a random user in a random group
  const randomUser = await User.findById(randomGroup.members[Math.floor(Math.random() * randomGroup.members.length)]._id)
  let finalized = false
  let finalDate

  const generateFakeDates = () => {
    // options for stringifying date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }

    // chance of instead generating a hangout that already occured
    if (Math.random() < 0.2) {
      finalDate = new Date(faker.date.recent(60)).toLocaleDateString(undefined, options)
      finalized = true

      return {
        [finalDate]: []
      }
    }

    // generates a random date, no sooner than 3 days from now
    const generateDate = () => {
      const threeDaysFromNow = new Date(new Date().setDate(new Date().getDate() + 3))
      const randomDate = faker.date.soon(30, threeDaysFromNow)
      return new Date(randomDate).toLocaleDateString(undefined, options)
    }

    // make sure there's 1 date minimum
    const fakeDates = {
      [generateDate()]: []
    }

    // 8 times, 50% chance each time of adding a new date with no duplicates
    for (let i = 0; i < 8; i++) {
      if (Math.random() < 0.5) {
        let date = generateDate()
        if (!(date in fakeDates)) fakeDates[date] = []

        // 10% chance the hangout will be finalized
        if (Math.random() < 0.1) {
          finalized = true
          finalDate = date
        }
      }
    }

    return fakeDates
  }

  const newHangout = new Hangout({
    title: getRandomTitle('hangout'),
    description: faker.lorem.paragraph(),
    location: faker.address.city(),
    planner: randomUser.id,
    group: randomGroup.id,
    groupPath: randomGroup.path,
    dateOptions: generateFakeDates(),
    path: nanoid(6),
    attendees: [],
    finalized,
    finalDate
  })

  await newHangout.save()

  randomUser.hangouts.push(newHangout.id)
  await randomUser.save()

  randomGroup.hangouts.push(newHangout.id)
  await randomGroup.save()

  // send out notifications
  await sendNewHangoutNotification(newHangout, randomGroup)
}

/**
 *  function to make random users join random groups
 */
const seedMemberships = async () => {
  const randomUser = await getRandomModel('user')
  const randomGroup = await getRandomModel('group')

  // don't let user join twice, or admin join again
  const alreadyJoined = () => {
    let usersGroups = randomUser.groups.map((grp) => grp.id)
    let groupMembers = randomGroup.members.map((mem) => mem.toString())
    let isAdmin = randomGroup.admin.toString() === randomUser.id

    return (
      usersGroups.includes(randomGroup.id) ||
      groupMembers.includes(randomUser.id) ||
      isAdmin
    )
  }

  if (!alreadyJoined()) {
    randomUser.groups.push(randomGroup.id)
    await randomUser.save()

    randomGroup.members.push(randomUser.id)
    await randomGroup.save()

    await sendNewMemberNotification(randomUser, randomGroup)
  }
}

/**
 * seeds random attendances between users/hangouts
 *
 *  - pick a random group
 *  - pick a random user within that group
 *  - pick a random hangout within that group
 *  - attend!
 */
const seedAttendances = async () => {
  const randomGroup = await getRandomModel('group')

  // early return if group has no users or hangouts
  if (randomGroup.members.length === 0 || randomGroup.hangouts.length === 0) return

  const randomUserId = randomGroup.members[Math.floor(Math.random() * randomGroup.members.length)]._id
  const randomUser = await User.findById(randomUserId)

  const randomHangoutId = randomGroup.hangouts[Math.floor(Math.random() * randomGroup.hangouts.length)]._id
  const randomHangout = await Hangout.findById(randomHangoutId)

  // don't let user join twice, or admin join again
  const alreadyJoined = () => {
    let userHangouts = randomUser.hangouts.map((hangout) => hangout.id)
    let hangoutAttendees = randomHangout.attendees.map((mem) => mem.toString())
    let isPlanner = randomHangout.planner.toString() === randomUser.id

    return (
      userHangouts.includes(randomHangout.id) ||
      hangoutAttendees.includes(randomUser.id) ||
      isPlanner
    )
  }

  if (!alreadyJoined()) {
    randomUser.hangouts.push(randomHangout.id)
    await randomUser.save()

    randomHangout.attendees.push(randomUser.id)

    // guarantees 1 vote, then 50% chance user is available
    let firstVote = true
    for (let [date, votes] of randomHangout.dateOptions) {

      if (Math.random() < 0.5 || firstVote) {
        votes.push(randomUser.id)
        randomHangout.dateOptions.set(date, votes)

        firstVote = false
      }
    }

    await randomHangout.save()

    await sendNewAttendeeNotification(randomUser, randomHangout)
  }
}


try {
  mongoose.connect(config.MONGODB_URI)
  logger.info('connected to MongoDB')
} catch (error) {
  logger.error('error connecting to MongoDB:', error.message)
}

const seedDb = async () => {
  // seeding a handful of users first to be group admins
  for (let i = 0; i < GROUPSCOUNT; i++) {
    await createSeedUser(i)
  }

  for (let i = 0; i < GROUPSCOUNT; i++) {
    await createSeedGroup(i)
  }

  // seeding everyone else
  for (let i = 0; i < USERSCOUNT; i++) {
    await createSeedUser()
  }

  // seed memberships
  for (let i = 0; i < MEMBERSHIPSCOUNT; i++) {
    await seedMemberships()
  }

  // seed hangouts
  for (let i = 0; i < HANGOUTSCOUNT; i++) {
    await createSeedHangout()
  }

  // seed attendances
  for (let i = 0; i < ATTENDANCESCOUNT; i++) {
    await seedAttendances()
  }
}

seedDb().then(() => mongoose.connection.close())
