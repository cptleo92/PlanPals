const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const User = require('../models/userModel')
const Group = require('../models/groupModel')

const testUsers = [
  {
    name: 'Alan',
    email: 'alan@test.com',
    password: 'password'
  },
  {
    name: 'Bob',
    email: 'ben@test.com',
    password: 'password'
  },
  {
    name: 'Cora',
    email: 'cora@test.com',
    password: 'password'
  },
]

const testGroups = [
  {
    title: 'Fishing Club',
    description: 'A club for fishing'
  },
  {
    title: 'Coffee Lovers',
    description: 'A club for coffee lovers'
  },
]

let token

beforeEach(async () => {
  await User.deleteMany({})
  await Group.deleteMany({})

  for (let testUser of testUsers) {
    await api.post('/api/users').send(testUser)
  }

  // login a user
  const response = await api
    .post('/api/users/login')
    .send(testUsers[0])

  token = response.body.token
})

describe('creating a new group', () => {
  // const request = {
  //   headers: {
  //     authorization: ''
  //   }
  // }

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

  test('successful creation returns proper json', async () => {
    for (let testGroup of testGroups) {
      await api
        .post('/api/groups')
        .set('Authorization', `Bearer ${token}`)
        .send(testGroup)
    }

    const allGroups = await Group.find({})
    expect(allGroups.length).toEqual(testGroups.length)

    const currentUser = await User.findOne({ name: testUsers[0].name })

    for (let group of allGroups) {
      expect(group).toHaveProperty('id')
      expect(group).toHaveProperty('title')
      expect(group).toHaveProperty('description')
      expect(group.admin).toEqual(currentUser._id)
      expect(group.members.length).toEqual(1)
    }
  })
})

afterAll(done => {
  mongoose.connection.close()
  done()
})