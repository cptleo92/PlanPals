const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const User = require('../models/userModel')
const Group = require('../models/groupModel')
const Hangout = require('../models/hangoutModel')

const seedDb = require('./seed_db/seed.json')
const { seedUsers, seedGroups, loginTestUser, logDb } = require('./seed_db/test_helpers')

const testUsers = Object.values(seedDb.testUsers)
const testGroups = Object.values(seedDb.testGroups)
let testHangouts = Object.values(seedDb.testHangouts)

let token

// returns a properly formatted test hangout with user and group added
const formatHangouts = async (hangouts) => {
  let groups = await Group.find({})

  testHangouts = hangouts.map(hangout => {
    let randomGroup = groups[Math.floor(Math.random() * groups.length)]

    return {
      ...hangout,
      dateOptions: hangout.dateOptions.map(date => new Date(date)),
      group: randomGroup.id,
      groupPath: randomGroup.path,
    }
  })
}

beforeAll(async () => {
  await User.deleteMany({})
  await Group.deleteMany({})
  await Hangout.deleteMany({})

  await seedUsers(testUsers)
  token = await loginTestUser(testUsers[0])
  // logDb()
  await seedGroups(testGroups, token)

  await formatHangouts(testHangouts)
})

describe('creating a new hangout', () => {
  test('creation fails if logged out', async () => {

    const response = await api
      .post('/api/hangouts')
      .send(testHangouts[0])
      .expect(401)

    expect(response.body.error).toEqual('No token found')

    const allHangouts = await Hangout.find({})
    expect(allHangouts.length).toEqual(0)
  })

  test('creation fails if hangout is invalid', async () => {
    const invalidHangout = {
      ...testHangouts[0]
    }

    invalidHangout.title = ''

    const response = await api
      .post('/api/groups')
      .set('Authorization', `Bearer ${token}`)
      .send(invalidHangout)
      .expect(400)

    expect(response.body.error).toEqual('All fields are required!')

    const allHangouts = await Hangout.find({})
    expect(allHangouts.length).toEqual(0)
  })

  test('successful creation returns proper json and adds new hangout to user and group', async () => {

    for (let testHangout of testHangouts) {
      await api
        .post('/api/hangouts')
        .set('Authorization', `Bearer ${token}`)
        .send(testHangout)
    }

    const allHangouts = await Hangout.find({})
    expect(allHangouts.length).toEqual(testHangouts.length)

    const currentUser = await User.findOne({ name: testUsers[0].name })

    const hangout = allHangouts[0]
    const group = await Group.findById(hangout.group.id)
    // const groups = await Group.find({})
    // console.log(groups, allHangouts)

    expect(hangout).toHaveProperty('id')
    expect(hangout).toHaveProperty('title')
    expect(hangout).toHaveProperty('description')
    expect(hangout.planner).toEqual(currentUser._id)
    expect(hangout).toHaveProperty('dateOptions')

    // making sure the new hangouts were added to the user
    expect(currentUser.hangouts.length).toEqual(testHangouts.length)


    // making sure hangouts were added to their respective groups
    expect(group.hangouts).toContainEqual(hangout._id)
  })
})

afterAll((done) => {
  mongoose.connection.close()
  done()
})