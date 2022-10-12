const Group = require('../models/groupModel')

const getMyGroups = () => {}

const createGroup = async (request, response) => {
  const { title, description } = request.body

  if (!title || !description) {
    response.status(400).json({ error: 'All fields are required!' })
  }

  // don't allow user to have duplicate group titles

  const newGroup = new Group({
    title,
    description,
    admin: request.user.id,
    members: [request.user.id]
  })

  try {
    await newGroup.save()
    response.status(201).json({
      _id: newGroup.id,
      title: newGroup.title,
      description: newGroup.description,
      admin: request.user.id,
      members: [request.user.id]
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