const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const User = require('../models/userModel')
const Group = require('../models/groupModel')
const Hangout = require('../models/hangoutModel')

const seedDb = require('./seed_db/seed.json')
const { seedUsers, seedGroups, loginTestUser } = require('./seed_db/test_helpers')

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
      group: randomGroup.id,
      groupPath: randomGroup.path,
    }
  })
}

beforeAll(async () => {
  try {
    await User.deleteMany({})
    await Group.deleteMany({})
    await Hangout.deleteMany({})

    await seedUsers(testUsers)
    token = await loginTestUser(testUsers[0])

    await seedGroups(testGroups, token)

    await formatHangouts(testHangouts)
  } catch (error) {
    console.error(error)
  }
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
      testHangout.dateOptions = JSON.stringify(testHangout.dateOptions)

      await api
        .post('/api/hangouts')
        .set('Authorization', `Bearer ${token}`)
        .send(testHangout)

    }


    const allHangouts = await Hangout.find({})
    expect(allHangouts.length).toEqual(testHangouts.length)

    const currentUser = await User.findOne({ firstName: testUsers[0].firstName })

    const hangout = allHangouts[0]

    expect(hangout).toHaveProperty('id')
    expect(hangout).toHaveProperty('title')
    expect(hangout).toHaveProperty('description')
    expect(hangout.planner.id).toEqual(currentUser.id)
    expect(hangout).toHaveProperty('dateOptions')

    // making sure the new hangouts were added to the user
    expect(currentUser.hangouts.length).toEqual(testHangouts.length)

    // making sure hangouts were added to their respective groups
    for (let hangout of allHangouts) {
      let group = await Group.findById(hangout.group)
      let groupHangouts = group.hangouts.map(hout => hout.id)
      expect(groupHangouts).toContain(hangout.id)
    }
  })
})

describe('attending a handout', () => {
  let testHangout, dateVotes
  beforeAll(async () => {
    testHangout = await Hangout.findOne({ title: testHangouts[0].title })

    dateVotes = Array.from(testHangout.dateOptions.keys())
  })

  test('cannot attend a hangout twice or if user is planner', async () => {
    const response = await api
      .post(`/api/hangouts/${testHangout.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(dateVotes)
      .expect(400)

    expect(response.body.error).toEqual('You are already attending this hangout')
  })

  test('successfully attending a hangout updates models correctly', async () => {
    let testUser = await User.findOne({ firstName: testUsers[1].firstName })
    let token2 = await loginTestUser(testUsers[1])

    const hangoutsCount = testUser.hangouts.length
    const attendeesCount = testHangout.attendees.length

    const response = await api
      .post(`/api/hangouts/${testHangout.id}`)
      .set('Authorization', `Bearer ${token2}`)
      .send(dateVotes)
      .expect(200)

    let attendees = response.body.attendees.map(att => att._id)
    expect(attendees).toContain(testUser.id)

    testHangout = await Hangout.findOne({ title: testHangouts[0].title })
    testUser = await User.findOne({ firstName: testUsers[1].firstName })

    expect(testHangout.attendees.length).toEqual(attendeesCount + 1)
    expect(testUser.hangouts.length).toEqual(hangoutsCount + 1)

    // hangout.dateOptions values should be filled with user id
    const dateVotesByUser = Array.from(testHangout.dateOptions.values())
    expect(dateVotesByUser.every(vote => vote.includes(testUser.id))).toEqual(true)

    // double checking that this person can't attend again
    const response2 = await api
      .post(`/api/hangouts/${testHangout.id}`)
      .set('Authorization', `Bearer ${token2}`)
      .expect(400)

    expect(response2.body.error).toEqual('You are already attending this hangout')
  })

  test('updates dateOptions correctly', async () => {

    let token2 = await loginTestUser(testUsers[1])

    dateVotes = ['Sunday, November 20, 2022']

    await api
      .patch(`/api/hangouts/updateVotes/${testHangout.id}`)
      .set('Authorization', `Bearer ${token2}`)
      .send(dateVotes)
      .expect(200)

    testHangout = await Hangout.findOne({ title: testHangouts[0].title })
    expect(testHangout.dateOptions.get('Sunday, November 20, 2022').length).toBe(1)
    expect(testHangout.dateOptions.get('Sunday, November 27, 2022').length).toBe(0)

    // test this out with a 3rd user
    let token3 = await loginTestUser(testUsers[2])
    dateVotes = ['Sunday, November 27, 2022']

    await api
      .post(`/api/hangouts/${testHangout.id}`)
      .set('Authorization', `Bearer ${token3}`)
      .send(dateVotes)
      .expect(200)

    testHangout = await Hangout.findOne({ title: testHangouts[0].title })
    expect(testHangout.dateOptions.get('Sunday, November 20, 2022').length).toBe(1)
    expect(testHangout.dateOptions.get('Sunday, November 27, 2022').length).toBe(1)

    dateVotes = ['Sunday, November 20, 2022']

    await api
      .patch(`/api/hangouts/updateVotes/${testHangout.id}`)
      .set('Authorization', `Bearer ${token3}`)
      .send(dateVotes)
      .expect(200)

    testHangout = await Hangout.findOne({ title: testHangouts[0].title })
    expect(testHangout.dateOptions.get('Sunday, November 20, 2022').length).toBe(2)
    expect(testHangout.dateOptions.get('Sunday, November 27, 2022').length).toBe(0)

  })
})

describe('leaving a hangout', () => {
  test('fails under invalid conditions', async () => {
    // user who is not attending and trying to leave should throw an error
    const testUser = await User.findOne({ firstName: testUsers[1].firstName })
    const token2 = await loginTestUser(testUsers[1])

    const testHangout = await Hangout.findOne({ title: testHangouts[2].title })

    expect(testHangout.attendees).not.toContain(testUser.id)

    const response = await api
      .delete(`/api/hangouts/${testHangout.id}`)
      .set('Authorization', `Bearer ${token2}`)
      .expect(400)

    expect(response.body.error).toEqual('You are already not attending')
  })

  test('successfully leaving a hangout updates models correctly', async () => {
    // using the success case from the 'attending a hangout' block
    let testUser = await User.findOne({ firstName: testUsers[1].firstName })
    const token2 = await loginTestUser(testUsers[1])
    let testHangout = await Hangout.findOne({ title: testHangouts[0].title })

    const hangoutsCount = testUser.hangouts.length
    const attendeesCount = testHangout.attendees.length

    await api
      .delete(`/api/hangouts/${testHangout.id}`)
      .set('Authorization', `Bearer ${token2}`)
      .expect(204)

    testUser = await User.findOne({ firstName: testUsers[1].firstName })
    testHangout = await Hangout.findOne({ title: testHangouts[0].title })
    expect(testHangout.attendees.length).toEqual(attendeesCount - 1)
    expect(testUser.hangouts.length).toEqual(hangoutsCount - 1)

    // user's date votes should be removed
    const dateVotesByUser = Array.from(testHangout.dateOptions.values())
    expect(dateVotesByUser.every(vote => !vote.includes(testUser.id))).toEqual(true)
  })

  test('kicking someone out of a hangout', async () => {
    // start by having a user attend
    let testUser = await User.findOne({ firstName: testUsers[1].firstName })
    let token2 = await loginTestUser(testUsers[1])
    let testHangout = await Hangout.findOne({ title: testHangouts[0].title })
    let dateVotes = Array.from(testHangout.dateOptions.keys())

    const hangoutsCount = testUser.hangouts.length
    const attendeesCount = testHangout.attendees.length

    await api
      .post(`/api/hangouts/${testHangout.id}`)
      .set('Authorization', `Bearer ${token2}`)
      .send(dateVotes)
      .expect(200)

    const body = {
      userId: testUser.id,
      hangoutId: testHangout.id
    }

    // first, make sure non-admin can't kick
    let response = await api
      .post('/api/hangouts/kick')
      .set('Authorization', `Bearer ${token2}`)
      .send(body)
      .expect(401)

    expect(response.body.error).toEqual('only planner can remove a user from the hangout')

    // use the planner's token and kick the new user
    await api
      .post('/api/hangouts/kick')
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .expect(204)

    // counts should have gone up 1 then back down 1
    testUser = await User.findOne({ firstName: testUsers[1].firstName })
    testHangout = await Hangout.findOne({ title: testHangouts[0].title })
    expect(testHangout.attendees.length).toEqual(attendeesCount)
    expect(testUser.hangouts.length).toEqual(hangoutsCount)

    // user's date votes should be removed
    const dateVotesByUser = Array.from(testHangout.dateOptions.values())
    expect(dateVotesByUser.every(vote => !vote.includes(testUser.id))).toEqual(true)
  })
})

describe('updating hangout information', () => {
  const newHangoutData = {
    description: 'EDITED DESCRIPTION'
  }

  test('fails if user is not hangout planner', async () => {
    let testHangout = await Hangout.findOne({ title: testHangouts[0].title })

    // sign in someone who isn't the planner
    const token3 = await loginTestUser(testUsers[2])

    const response = await api
      .patch(`/api/hangouts/${testHangout.id}`)
      .set('Authorization', `Bearer ${token3}`)
      .send(newHangoutData)
      .expect(401)

    expect(response.body.error).toEqual('only planner can update the hangout')
  })

  test('successful if valid', async () => {
    let testHangout = await Hangout.findOne({ title: testHangouts[0].title })

    const response = await api
      .patch(`/api/hangouts/${testHangout.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(newHangoutData)
      .expect(200)

    expect(response.body.description).toEqual(newHangoutData.description)

    testHangout = await Hangout.findOne({ title: testHangouts[0].title })
    expect(testHangout.description).toEqual(newHangoutData.description)
  })
})

describe('deleting a hangout', () => {
  let testHangout
  beforeAll(async () => {
    testHangout = await Hangout.findOne({ title: testHangouts[0].title })
  })

  test('fails if user is not the planner', async () => {
    const token2 = await loginTestUser(testUsers[1])

    const response = await api
      .delete(`/api/hangouts/delete/${testHangout.id}`)
      .set('Authorization', `Bearer ${token2}`)
      .expect(401)

    expect(response.body.error).toEqual('only planner can delete the hangout')
  })

  test('fails if hangout has attendees', async () => {
    const response = await api
      .delete(`/api/hangouts/delete/${testHangout.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(401)

    expect(response.body.error).toEqual('cannot delete if there are attendees')
  })

  test('successful deletion removes hangout from parent group and planner', async () => {
    let planner = await User.findById(testHangout.planner)

    const userHangoutsCount = planner.hangouts.length

    testHangout = await Hangout.findOne({ title: testHangouts[1].title })

    await api
      .delete(`/api/hangouts/delete/${testHangout.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    planner = await User.findById(testHangout.planner)
    expect(planner.hangouts.length).toBe(userHangoutsCount - 1)

  })
})

describe('finalizing a date', () => {
  let testHangout, finalDate
  beforeAll(async () => {
    testHangout = await Hangout.findOne({ title: testHangouts[0].title })
    finalDate = Array.from(testHangout.dateOptions.keys())[0]
  })

  test('successful finalization updates model correctly', async () => {
    const response = await api
      .patch(`/api/hangouts/finalize/${testHangout.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ finalDate })
      .expect(200)

    expect(response.body.finalized).toBe(true)

    testHangout = await Hangout.findOne({ title: testHangouts[0].title })
    expect(testHangout.finalDate).toEqual(new Date(finalDate))
  })

})

afterAll((done) => {
  mongoose.connection.close()
  done()
})