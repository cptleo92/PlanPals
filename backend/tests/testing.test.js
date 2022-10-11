const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

test('jest works', async () => {
  const res = await api.get('/test').expect(200)
  expect(res.body.message).toEqual('testing')
})

afterAll(done => {
  // Closing the DB connection allows Jest to exit successfully.
  mongoose.connection.close()
  done()
})
