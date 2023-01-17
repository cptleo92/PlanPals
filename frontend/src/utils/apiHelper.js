import axios from 'axios'

/**
 *  USERS
 */

export const registerUser = async (formData) => {
  try {
    const response = await axios.post('/api/users/', formData)
    return response.data
  } catch (err) {
    return err.response.data.error
  }
}

export const loginUser = async (formData) => {
  try {
    const response = await axios.post('/api/users/login', formData)
    return response.data
  } catch (err) {
    return err.response.data.error
  }
}

export const loginUserOauth = async (token) => {
  try {
    const response = await axios.post('/api/users/oauth2', token)
    return response.data
  } catch (err) {
    return err.response.data.error
  }
}

export const getUser = async (id) => {
  try {
    const response = await axios.get(`/api/users/${id}`)
    return response.data
  } catch (err) {
    return err.response.data.error
  }
}

export const updateUser = async (id, newUser) => {
  try {
    const response = await axios.patch(`/api/users/${id}`, newUser)
    return response.data
  } catch (err) {
    return err.response.data.error
  }
}

export const forgotPassword = async (email) => {
  try {
    const response = await axios.post('/api/users/password/forgot', email)
    return response.data
  } catch (err) {
    return err.response.data.error
  }
}

export const resetPassword = async (resetData) => {
  try {
    const response = await axios.post('/api/users/password/reset/', resetData)
    return response.data
  } catch (err) {
    return err.response.data.error
  }
}

export const getUserNotifications = async (id) => {
  try {
    const response = await axios.get(`/api/users/${id}/notifs`)
    return response.data
  } catch (err) {
    return err.response.data.error
  }
}

export const markNotificationsRead = async (id, notifications) => {
  try {
    for (let notif of notifications) notif.unread = 'false'

    const response = await axios.patch(`/api/users/${id}/notifs`, notifications)
    return response.data
  } catch (err) {
    return err.response.data.error
  }
}

/**
 *  GROUPS
 */

export const createGroup = async (formData) => {
  try {
    const response = await axios.post('/api/groups', formData)
    return response.data
  } catch (err) {
    return err.response.data.error
  }
}

export const getMyGroups = async () => {
  try {
    const response = await axios.get('/api/groups')
    return response.data
  } catch (err) {
    return err.response.data.error
  }
}

export const getGroup = async (id) => {
  try {
    const response = await axios.get(`/api/groups/${id}`)
    return response.data
  } catch (err) {
    return err.response.data.error
  }
}

export const updateGroup = async (id, newGroup) => {
  try {
    const response = await axios.patch(`/api/groups/${id}`, newGroup)
    return response.data
  } catch (err) {
    return err.response.data.error
  }
}

export const joinGroup = async (id) => {
  try {
    const response = await axios.post(`/api/groups/${id}`)
    return response.data
  } catch (err) {
    return err.response.data.error
  }
}

export const leaveGroup = async (id) => {
  try {
    const response = await axios.delete(`/api/groups/${id}`)
    return response.data
  } catch (err) {
    return err.response.data.error
  }
}

/**
 *  HANGOUTS
 */

export const createHangout = async (formData) => {
  try {
    const response = await axios.post('/api/hangouts', formData)
    return response.data
  } catch (err) {
    return err.response.data.error
  }
}

export const getHangoutByPath = async (path) => {
  try {
    const response = await axios.get(`/api/hangouts/${path}`)
    return response.data
  } catch (err) {
    return err.response.data.error
  }
}

export const getMyHangouts = async () => {
  try {
    const response = await axios.get('/api/hangouts/')
    return response.data
  } catch (err) {
    return err.response.data.error
  }
}


export const joinHangout = async (id, dateVotes) => {
  try {
    const response = await axios.post(`/api/hangouts/${id}`, dateVotes)
    return response.data
  } catch (err) {
    return err.response.data.error
  }
}

export const updateHangout = async (id, newHangoutData) => {
  try {
    const response = await axios.patch(`/api/hangouts/${id}`, newHangoutData)
    return response.data
  } catch (err) {
    return err.response.data.error
  }
}

export const updateHangoutDateVotes = async (id, dateVotes) => {
  try {
    const response = await axios.patch(`/api/hangouts/updateVotes/${id}`, dateVotes)
    return response.data
  } catch (err) {
    return err.response.data.error
  }
}

export const leaveHangout = async (id) => {
  try {
    await axios.delete(`/api/hangouts/${id}`)
  } catch (err) {
    return err.response.data.error
  }
}

export const finalizeHangout = async (id, finalDate) => {
  try {
    const response = await axios.patch(`/api/hangouts/finalize/${id}`, finalDate)
    return response.data
  } catch (err) {
    return err.response.data.error
  }
}