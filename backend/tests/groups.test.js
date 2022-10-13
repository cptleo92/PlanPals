const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const User = require('../models/userModel')
const Group = require('../models/groupModel')

const seedDb = require('./seed_db/seed.json')
const { seedUsers, loginTestUser } = require('./seed_db/test_helpers')

const testUsers = Object.values(seedDb.testUsers)
const testGroups = Object.values(seedDb.testGroups)

let token

beforeAll(async () => {
  await User.deleteMany({})
  await Group.deleteMany({})

  await seedUsers(testUsers)
  token = await loginTestUser(testUsers[0])
})

describe('creating a new group', () => {
  test('creation fails if logged out', async () => {
    const response = await api
      .post('/api/groups')
      .send(testGroups[0])
      .expect(401)

    expect(response.body.error).toEqual('Not authorized')

    const allGroups = await Group.find({})
    expect(allGroups.length).toEqual(0)
  })

  test('creation fails if group is invalid', async () => {
    const invalidGroup = {
      title: 'Random title'
    }

    const response = await api
      .post('/api/groups')
      .set('Authorization', `Bearer ${token}`)
      .send(invalidGroup)
      .expect(400)

    expect(response.body.error).toEqual('All fields are required!')

    const allGroups = await Group.find({})
    expect(allGroups.length).toEqual(0)
  })

  test('successful creation returns proper json and adds new groups to user', async () => {
    for (let testGroup of testGroups) {
      await api
        .post('/api/groups')
        .set('Authorization', `Bearer ${token}`)
        .send(testGroup)
    }

    const allGroups = await Group.find({})
    expect(allGroups.length).toEqual(testGroups.length)

    const currentUser = await User.findOne({ name: testUsers[0].name })

    const group = allGroups[0]

    expect(group).toHaveProperty('id')
    expect(group).toHaveProperty('title')
    expect(group).toHaveProperty('description')
    expect(group.admin).toEqual(currentUser._id)
    expect(group.members.length).toEqual(1)

    // making sure the new groups were added to the user
    expect(currentUser.groups.length).toEqual(testGroups.length)
  })
})

describe('joining a group', () => {
  let testGroup
  beforeAll(async () => {
    testGroup = await Group.findOne({ title: testGroups[0].title })
  })

  test('cannot join a group twice', async () => {
    const response = await api
      .post(`/api/groups/${testGroup.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)

    expect(response.body.error).toEqual('You are already in this group!')
  })

  test('successfully joining a new group updates models correctly', async () => {
    // login a different user
    const newUser = testUsers[1]
    let token2 = await loginTestUser(newUser)

    const originalMembersAmount = testGroup.members.length

    const response = await api
      .post(`/api/groups/${testGroup.id}`)
      .set('Authorization', `Bearer ${token2}`)
      .expect(200)

    expect(response.body.members.length).toEqual(originalMembersAmount + 1)

    const updatedTestUser = await User.findOne({ name: newUser.name })
    expect(updatedTestUser.groups.length).toEqual(1)
  })
})

afterAll(done => {
  mongoose.connection.close()
  done()
})