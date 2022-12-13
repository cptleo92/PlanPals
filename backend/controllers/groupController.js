const Group = require('../models/groupModel')
const User = require('../models/userModel')
const { nanoid } = require('nanoid')

const getMyGroups = async (request, response) => {
  const currentUser = await User.findById(request.user.id)
  response.json(currentUser.groups)
}

const getGroupByIDorPath = async (request, response) => {
  const query = request.params.id
  let group

  // populating here instead of the model as an experiment
  if (query.length !== 6) {
    group = await Group.findById(query)
  } else {
    group = await Group.findOne({ path: query })
  }

  response.json(group)
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
    hangouts: [],
    path: nanoid(6)
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
      hangouts: [],
      path: newGroup.path
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

  if (group.admin.id  === request.user.id) {
    return response.status(400).json({ error: 'admin cannot leave the group' })
  }

  const currentUser = await User.findById(request.user.id)

  try {
    currentUser.groups = currentUser.groups.filter((grp) => {
      return grp.id !== group.id
    })

    await currentUser.save()

    group.members = group.members.filter((member) => {
      return member.id !== currentUser.id
    })
    await group.save()

    response.status(204).end()
  } catch (error) {
    response.status(400).json({ error: error.message })
  }
}

const kickFromGroup = async (request, response) => {
  const { userId, groupId } = request.body

  const kickThisUser = await User.findById(userId)
  const kickFromThisGroup = await Group.findById(groupId)

  // only group's admin can kick
  if (request.user.id !== kickFromThisGroup.admin.id) {
    return response.status(401).json({ error: 'only admin can remove a user from the group' })
  }

  try {
    kickThisUser.groups = kickThisUser.groups.filter(group => group.id !== groupId)
    await kickThisUser.save()

    kickFromThisGroup.members = kickFromThisGroup.members.filter(member => member.id !== userId)
    await kickFromThisGroup.save()

    response.status(204).end()
  } catch (error) {
    response.status(400).json({ error: error.message })
  }
}

const updateGroup = async (request, response) => {
  const groupId = request.params.id
  const newGroupData = request.body

  let updateThisGroup = await Group.findById(groupId)

  // only group's admin can update
  if (request.user.id !== updateThisGroup.admin.id) {
    return response.status(401).json({ error: 'only admin can update the group' })
  }

  try {
    updateThisGroup = await Group.findByIdAndUpdate(groupId, newGroupData, { new: true })
    response.status(200).json(updateThisGroup)
  } catch (error) {
    response.status(400).json({ error: error.message })
  }
}

const deleteGroup = async (request, response) => {
  const groupId = request.params.id

  let deleteThisGroup = await Group.findById(groupId)

  // only group's admin can delete
  if (request.user.id !== deleteThisGroup.admin.id) {
    return response.status(401).json({ error: 'only admin can delete the group' })
  }

  try {
    await deleteThisGroup.remove()

    response.sendStatus(204)
  } catch (error) {
    response.status(400).json({ error: error.message })
  }
}

module.exports = {
  getMyGroups,
  createGroup,
  joinGroup,
  leaveGroup,
  kickFromGroup,
  getGroupByIDorPath,
  updateGroup,
  deleteGroup
}
