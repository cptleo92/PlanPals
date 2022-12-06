const Group = require('../models/groupModel')
const User = require('../models/userModel')
const Hangout = require('../models/hangoutModel')

const { faker } = require('@faker-js/faker')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const config = require('../utils/config')
const logger = require('../utils/logger')
const { nanoid } = require('nanoid')

const USERSCOUNT = 20
const GROUPSCOUNT = 5

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
    name: `${firstName} ${lastName}`,
    email,
    password,
  })

  await newUser.save()
}

const createSeedGroup = async (i) => {
  const allUsers = await User.find()

  const randomAdmin = allUsers[i]

  const newGroup = new Group({
    title: faker.lorem.sentence(4),
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
 *  function to make random users join random groups
 */
const seedMemberships = async () => {
  const allUsers = await User.find()
  const allGroups = await Group.find()

  const randomUser = allUsers[Math.floor(Math.random() * USERSCOUNT)]
  const randomGroup = allGroups[Math.floor(Math.random() * GROUPSCOUNT)]

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
  }
}

try {
  mongoose.connect(config.MONGODB_URI)
  logger.info('connected to MongoDB')
} catch (error) {
  logger.error('error connecting to MongoDB:', error.message)
}

const seedDb = async () => {
  await User.deleteMany()
  await Group.deleteMany()
  await Hangout.deleteMany()

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
  for (let i = 0; i < 40; i++) {
    await seedMemberships()
  }
}

seedDb().then(() => mongoose.connection.close())
