const User = require('../models/userModel')

const sendNewMemberNotification = async (request, newUser, group) => {
  const usersToNotify = [group.admin._id]

  for (let member of group.members) {
    if (member.id !== newUser.id) usersToNotify.push(member._id)
  }

  const newNotif = {
    text: `${newUser.firstName} has joined your group: ${group.title}!`,
    creationDate: new Date(),
    unread: 'true',
    href: `/groups/${group.path}`
  }

  for (let userId of usersToNotify) {

    try {

      const user = await User.findById(userId)
      user.notifications.unshift(newNotif)
      user.save()

    } catch (error) {
      console.error(error)
    }

  }
}

module.exports = {
  sendNewMemberNotification
}