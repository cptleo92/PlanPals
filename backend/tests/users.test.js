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

describe('user creation', () => {
  test('fails if invalid', async () => {
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

    const allUsers = await User.find({})
    expect(allUsers.length).toEqual(1)
  })

  test('successful if valid', async () => {
    const newUser = {
      name: 'Leo',
      email: 'leo@leo.com',
      password: 'password'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)

    expect(response.body.token).toBeTruthy()

    const allUsers = await User.find({})
    expect(allUsers.length).toEqual(2)
    expect(allUsers.map(user => user.name)).toContain('Leo')
  })
})

describe('user login', () => {
  test('fails if invalid credentials', async () => {
    const testUserWrong = {
      email: 'test@test.com',
      password: 'password1'
    }

    const response = await api
      .post('/api/users/login')
      .send(testUserWrong)
      .expect(400)

    expect(response.body.error).toEqual('Invalid credentials')
  })

  test('success if valid credentials', async () => {
    const response = await api
      .post('/api/users/login')
      .send(testUser)
      .expect(201)

    expect(response.body.token).toBeTruthy()
  })
})


afterAll(done => {
  mongoose.connection.close()
  done()
})
