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