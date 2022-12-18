import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { createGroup } from '../../utils/apiHelper'
import { getGroup, updateGroup } from '../../utils/apiHelper'
import { useCurrentUser } from '../../utils/hooks'

import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import PhotoUpload from '../Misc/PhotoUpload'

const GroupForm = ({ edit }) => {
  const navigate = useNavigate()
  const { groupPath } = useParams()
  const { user } = useCurrentUser()

  const [file, setFile] = useState()

  const { error, data: group } = useQuery({
    queryKey: ['group', groupPath],
    queryFn: () => getGroup(groupPath),
    enabled: !!groupPath
  })

  if (error) {
    navigate('/error')
    console.log(error)
  }

  const [formData, setFormData] = useState({
    title: group ? group.title : '',
    description: group ? group.description : '',
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
      try {
        if (edit) {
          await updateGroup(group._id, formData)
        } else {
          await createGroup(formData)
        }
        navigate('/home')
      } catch (error) {
        navigate('/error')
        console.log(error)
      }

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


  useEffect(() => {
    if (group && group.admin._id !== user._id) {
      navigate('/error')
    }
  }, [group, navigate, user._id])

  return (
    <>
      <Typography variant="h3" component="h2" mt={3}>
        {edit ? 'Edit Your Group!' : 'Create a new group!'}
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

          <PhotoUpload file={file} setFile={setFile} />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {edit ? 'Update' : 'Create'}
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </Stack>
      </Box>
    </>
  )
}

export default GroupForm
