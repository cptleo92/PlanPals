import axios from 'axios'

export const registerUser = async (formData) => {
  try {
    const response = await axios.post('/api/users/', formData) 
    return response.data
  } catch (err) {
    console.log(err)
  }
}

export const loginUser = async (formData) => {
  try {
    const response = await axios.post('/api/users/login', formData) 
    return response.data
  } catch (err) {
    console.log(err)
  }
}