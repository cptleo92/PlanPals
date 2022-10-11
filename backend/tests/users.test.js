const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const User = require('../models/userModel')

const testUser = {
  name: 'Test',
  email: 'test@test.com',
  password: 'password'
}

beforeEach(async () => {
  await User.deleteMany({})
  await api.post('/api/users').send(testUser)
})

describe('user routes', () => {
  test('user creation fails if invalid', async () => {
    const badEmail = {
      name: 'no good',
      email: 'nothing@',
      password: 'password'
    }

    const badPassword = {
      name: 'also no good',
      email: 'bad@password.com',
      password: 'abcde'
    }

    const testUserCopy = {
      name: 'Test',
      email: 'test@test.com',
      password: 'password'
    }

    await api
      .post('/api/users')
      .send(badEmail)
      .expect(400)

    await api
      .post('/api/users')
      .send(badPassword)
      .expect(400)

    await api
      .post('/api/users')
      .send(testUserCopy)
      .expect(400)
  })

  test('user creation successful if valid', async () => {
    const newUser = {
      name: 'Leo',
      email: 'leo@leo.com',
      password: 'password'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)

    const allUsers = await User.find({})
    expect(allUsers.length).toEqual(2)
  })
})


afterAll(done => {
  // Closing the DB connection allows Jest to exit successfully.
  mongoose.connection.close()
  done()
})
