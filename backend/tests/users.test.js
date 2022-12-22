const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const User = require('../models/userModel')

const testUser = {
  firstName: 'Test',
  lastName: 'Best',
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
      firstName: 'No',
      lastName: 'Good',
      email: 'nothing@',
      password: 'password'
    }

    const badPassword = {
      firstName: 'also',
      lastName: 'nogood',
      email: 'bad@password.com',
      password: 'abcde'
    }

    const badName = {
      firstName: 'also',
      lastName: ' no good',
      email: 'bad@name.com',
      password: 'password'
    }

    const testUserCopy = {
      firstName: 'Test',
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
      .send(badName)
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
      firstName: 'Leo',
      lastName: 'Cheng',
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
    expect(allUsers.map(user => user.fullName)).toContain('Leo Cheng')
  })

  test('capitalizes name properly', async () => {
    const newUser = {
      firstName: 'lower',
      lastName: 'upper',
      email: 'lower@upper.com',
      password: 'password'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)

    expect(response.body.fullName).toEqual('Lower Upper')
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

    expect(response.body.error).toEqual('Invalid credentials.')
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
