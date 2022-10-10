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

app.use(middleware.requestLogger)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

app.listen(process.env.PORT, () => console.log(`Server started on port ${process.env.PORT}`))

module.exports = app