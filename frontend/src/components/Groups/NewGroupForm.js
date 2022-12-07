import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createGroup } from '../../utils/apiHelper'

import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'

const NewGroupForm = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
  })

  const [titleError, setTitleError] = useState('')
  const [descriptionError, setDescriptionError] = useState('')

  const validateFields = () => {
    let noErrors = true

    if (formData.title === '') {
      setTitleError('Title is required.')
      noErrors = false
    }

    if (formData.description === '') {
      setDescriptionError('Description is required.')
      noErrors = false
    }

    return noErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateFields()) {
      const response = await createGroup(formData)
      console.log(response)
      navigate('/home')
    }
  }

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))

    if (e.target.name === 'title') setTitleError('')
    if (e.target.name === 'description') setDescriptionError('')
  }

  return (
    <>
      <Typography variant="h3" component="h2" mt={3}>
        Create a new group!
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ mt: 3, width: 2 / 3 }}
      >
        <Stack spacing={3}>
          <TextField
            error={titleError !== ''}
            helperText={titleError}
            required
            id="title"
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />

          <TextField
            error={descriptionError !== ''}
            helperText={descriptionError}
            required
            id="description"
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
            placeholder="Write a short description for your new group!"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Create
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => navigate('/home')}
          >
            Go Back
          </Button>
        </Stack>
      </Box>
    </>
  )
}

export default NewGroupForm
