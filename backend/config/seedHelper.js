const Group = require('../models/groupModel')
const User = require('../models/userModel')
const Hangout = require('../models/hangoutModel')
const { faker } = require('@faker-js/faker')

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


const getRandomTitle = (type) => {

  const hangoutOptions = [
    `Learn to ${faker.word.verb()} class anyone?`,
    `${faker.music.genre()} concert!`,
    `Biking across the bridge? I have an extra ${faker.vehicle.bicycle()}`,
    `${faker.company.catchPhrase()}`,
    `Going away party for ${faker.name.firstName()}!`,
    `Free ${faker.commerce.product()} at the park!`,
    `Adopt a ${faker.animal.dog()}`,
    `Zoo has a new ${faker.animal.type()}`,
    `Day trip to ${faker.address.cityName()}?`
  ]

  const groupOptions = [
    `Friends of ${faker.name.firstName()}`,
    `${faker.company.name()}`,
    `${faker.commerce.productName()}`,
    `We love ${faker.vehicle.manufacturer()}`,
    `${faker.music.genre()} enthusiasts`,
    `${faker.name.jobTitle()}s`,
    `${faker.commerce.department()} department colleagues`,
    `${faker.music.songName()}`,
  ]

  if (type === 'hangout') {
    return hangoutOptions[~~(Math.random() * hangoutOptions.length)]
  } else {
    return groupOptions[~~(Math.random() * groupOptions.length)]
  }
}


module.exports = {
  getRandomModel,
  getRandomTitle
}