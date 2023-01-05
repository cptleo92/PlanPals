const User = require('../models/userModel')

const sendNewMemberNotification = async (newUser, group) => {
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

const sendNewAttendeeNotification = async (newUser, hangout) => {
  const usersToNotify = [hangout.planner._id]

  for (let att of hangout.attendees) {
    if (att.id !== newUser.id) usersToNotify.push(att._id)
  }

  const newNotif = {
    text: `${newUser.firstName} is attending: ${hangout.title}!`,
    creationDate: new Date(),
    unread: 'true',
    href: `/groups/${hangout.groupPath}/hangouts/${hangout.path}`
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

const sendNewHangoutNotification = async (newHangout, group) => {
  const usersToNotify = []

  if (group.admin.id !== newHangout.planner.id) usersToNotify.push(group.admin.id)

  for (let member of group.members) {
    if (member.id !== newHangout.planner.id) usersToNotify.push(member.id)
  }

  const newNotif = {
    text: `${newHangout.planner.firstName} is hosting a new hangout: ${newHangout.title}!`,
    creationDate: new Date(),
    unread: 'true',
    href: `/groups/${newHangout.groupPath}/hangouts/${newHangout.path}`
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

const sendFinalizedHangoutNotification = async (hangout, notifyPlanner = false) => {
  const usersToNotify = []

  for (let att of hangout.attendees) {
    usersToNotify.push(att._id)
  }

  const newNotif = {
    text: `Save the date for your upcoming hangout! ${hangout.title}`,
    creationDate: new Date(),
    unread: 'true',
    href: `/groups/${hangout.groupPath}/hangouts/${hangout.path}`
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

  if (notifyPlanner) {
    const plannerNotif = {
      text: `Your hangout has been automaticlaly finalized: ${hangout.title}`,
      creationDate: new Date(),
      unread: 'true',
      href: `/groups/${hangout.groupPath}/hangouts/${hangout.path}`
    }

    try {

      const planner = await User.findById(hangout.planner.id)
      planner.notification.unshift(plannerNotif)
      planner.save()

    } catch (error) {
      console.error(error)
    }
  }
}

module.exports = {
  sendNewMemberNotification,
  sendNewAttendeeNotification,
  sendNewHangoutNotification,
  sendFinalizedHangoutNotification
}