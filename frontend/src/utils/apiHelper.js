import axios from 'axios'

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