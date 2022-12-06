const Group = require('../models/groupModel')
const User = require('../models/userModel')
const Hangout = require('../models/hangoutModel')

const getRandomModel = async (model) => {
  let allType

  switch (model) {
  case 'user':
    allType = await User.find()
    break
  case 'group':
    allType = await Group.find()
    break
  case 'hangout':
    allType = await Hangout.find()
    break
  default:
    break
  }
  return allType[Math.floor(Math.random() * allType.length)]
}

module.exports = {
  getRandomModel
}