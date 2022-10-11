const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const middleware = require('./utils/middleware')
const connectDB = require('./config/db')

connectDB()

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

if (process.env.NODE_ENV === 'test') {
  app.get('/test', (req, res) => {
    res.json({ 'message': 'testing' })
  })
}

app.use(middleware.requestLogger)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app