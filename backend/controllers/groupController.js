const Group = require('../models/groupModel')
const User = require('../models/userModel')

const getMyGroups = () => {}

const createGroup = async (request, response) => {
  const { title, description } = request.body

  if (!title || !description) {
    response.status(400).json({ error: 'All fields are required!' })
  }

  // don't allow user to have duplicate group titles

  const currentUser = await User.findById(request.user.id)

  const newGroup = new Group({
    title,
    description,
    admin: currentUser.id,
    members: [currentUser.id]
  })

  try {
    await newGroup.save()

    currentUser.groups.push(newGroup.id)
    await currentUser.save()

    response.status(201).json({
      _id: newGroup.id,
      title: newGroup.title,
      description: newGroup.description,
      admin: currentUser.id,
      members: [currentUser.id]
    })
  } catch (error) {
    response.status(400).json({ error: error.message })
  }

}

const joinGroup = () => {}

const removeFromGroup = () => {}


module.exports = {
  getMyGroups,
  createGroup,
  joinGroup,
  removeFromGroup,
}