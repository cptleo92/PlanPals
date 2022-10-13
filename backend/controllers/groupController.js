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
    members: [],
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
      members: [],
    })
  } catch (error) {
    response.status(400).json({ error: error.message })
  }
}

const joinGroup = async (request, response) => {
  const groupId = request.params.id

  const currentUser = await User.findById(request.user.id)
  const groupToJoin = await Group.findById(groupId)

  // don't let user join twice, or admin join again
  const alreadyJoined = () => {
    let usersGroups = currentUser.groups.map((grp) => grp.id)
    let groupMembers = groupToJoin.members.map((mem) => mem.toString())
    let isAdmin = groupToJoin.admin.toString() === request.user.id

    return (
      usersGroups.includes(groupId) ||
      groupMembers.includes(currentUser.id) ||
      isAdmin
    )
  }

  if (alreadyJoined()) {
    return response
      .status(400)
      .json({ error: 'You are already in this group!' })
  }

  try {
    currentUser.groups.push(groupId)
    await currentUser.save()

    groupToJoin.members.push(currentUser.id)
    await groupToJoin.save()

    response.json(groupToJoin)
  } catch (error) {
    response.status(400).json({ error: error.message })
  }
}

const leaveGroup = async (request, response) => {
  // admin can't leave group
  const group = await Group.findById(request.params.id)

  if (!group) {
    return response.status(404).json({ error: 'group not found' })
  }

  if (group.admin.toString() === request.user.id) {
    return response.status(400).json({ error: 'admin cannot leave the group' })
  }

  const currentUser = await User.findById(request.user.id)

  try {
    currentUser.groups = currentUser.groups.filter((grp) => {
      // console.log(typeof grp.id)
      return grp.id !== group.id
    })

    await currentUser.save()

    group.members = group.members.filter((member) => {
      // console.log(member.toString())
      return member.toString() !== currentUser.id
    })
    await group.save()

    response.status(204).end()
  } catch (error) {
    response.status(400).json({ error: error.message })
  }
}

module.exports = {
  getMyGroups,
  createGroup,
  joinGroup,
  leaveGroup,
}
