const express = require('express')
require('express-async-errors')
const app = express()
const path = require('path')
const cors = require('cors')
const middleware = require('./utils/middleware')
const connectDB = require('./config/db')

connectDB()

app.use(cors())
app.use(express.json())

// routes
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/groups', require('./routes/groupRoutes'))
app.use('/api/hangouts', require('./routes/hangoutRoutes'))

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') {
  const root = path.join(__dirname, 'build')

  app.use(express.static(root))

  app.get('*', function (req, res) {
    res.sendFile('index.html', { root })
  })
}

app.use(middleware.requestLogger)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)



module.exports = app