const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const { JWT_SECRET } = require('../utils/config')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  switch (error.name) {
  case 'CastError':
    return response.status(400).send({ error: 'malformatted id' })
  case 'ValidationError':
    return response.status(400).json({ error: error.message })
  case 'JsonWebTokenError':
    return response.status(401).json({ error: 'invalid token' })
  case 'TokenExpiredError':
    return response.status(401).json({ error: 'token expired' })
  }

  next(error)
}

const auth = async (request, response, next) => {
  let token

  if (request.headers.authorization?.startsWith('Bearer')) {
    try {
      token = request.headers.authorization.split(' ')[1]

      const decoded = jwt.verify(token, JWT_SECRET)

      // token expiration check
      // if (decoded.exp < Date.now() / 1000) {
      //   console.log('success')

      // }

      request.user = await User.findById(decoded.id).select('-password')

      next()
    } catch (error) {
      logger.error(error.message)
      if (error.message === 'jwt expired') {
        return response.status(401).json({ error: 'Token expired' })
      }
      response.status(401).json({ error: 'Not authorized' })
    }
  }

  if (!token) {
    response.status(401).json({ error: 'No token found' })
  }
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  auth
}