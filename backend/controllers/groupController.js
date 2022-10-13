const Group = require('../models/groupModel')
const User = require('../models/userModel')

const getMyGroups = async (request, response) => {
  const currentUser = await User.findById(request.user.id)

  response.json(currentUser.groups)
}

const createGroup = async (request, response) => {
  const { title, description } = request.body

  if (!title || !description) {
    return response.status(400).json({ error: 'All fields are required!' })
  }

  const currentUser = await User.findById(request.user.id)

  const newGroup = new Group({
    title,
    description,
    admin: currentUser.id,
    members: [currentUser.id],
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
      members: [currentUser.id],
    })
  } catch (error) {
    response.status(400).json({ error: error.message })
  }
}

const joinGroup = async (request, response) => {
  const groupId = request.params.id

  const currentUser = await User.findById(request.user.id)
  const groupToJoin = await Group.findById(groupId)

  // don't let user join twice
  const alreadyJoined = () => {
    let usersGroups = currentUser.groups.map(grp => grp.id)
    let groupMembers = groupToJoin.members.map(mem => mem.toString())

    // groups.forEach(g => console.log('Group: ', g))
    // members.forEach(m => console.log('Member: ', m))
    // console.log('-------------')
    // console.log(groups, '//', members)
    // console.log(groups.includes(currentUser.id), '//', members.includes(currentUser.id))

    return usersGroups.includes(groupId) || groupMembers.includes(currentUser.id)
  }

  if (alreadyJoined()) {
    return response.status(400).json({ error: 'You are already in this group!' })
  }

  currentUser.groups.push(groupId)
  await currentUser.save()

  groupToJoin.members.push(currentUser.id)
  await groupToJoin.save()

  response.json(groupToJoin)
}

const removeFromGroup = () => {}

module.exports = {
  getMyGroups,
  createGroup,
  joinGroup,
  removeFromGroup,
}
