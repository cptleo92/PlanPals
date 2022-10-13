const User = require('../../models/userModel')
const Group = require('../../models/groupModel')

const supertest = require('supertest')
const app = require('../../app')
const api = supertest(app)

const seedUsers = async (testUsers) => {
  for (let testUser of testUsers) {
    await api.post('/api/users').send(testUser)
  }
}

const seedGroups = async (testGroups, token) => {
  for (let testGroup of testGroups) {
    await api
      .post('/api/groups')
      .set('Authorization', `Bearer ${token}`)
      .send(testGroup)
  }
}

const loginTestUser = async (testUser) => {
  const response = await api
    .post('/api/users/login')
    .send(testUser)

  return response.body.token
}

const logDb = async () => {
  const allUsers = await User.find({}).populate('groups')
  const allGroups = await Group.find({}).populate('members')
  console.log(allUsers, allGroups)
}

module.exports = {
  seedUsers,
  seedGroups,
  loginTestUser,
  logDb
}
