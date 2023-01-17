import { useState } from 'react'
import AvatarImageCropper from 'react-avatar-image-cropper'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCurrentUser } from '../../utils/hooks'
import { useNavigate } from 'react-router-dom'

import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { updateUser } from '../../utils/apiHelper'


const UserPage = () => {
  const { user, setUser } = useCurrentUser()
  const navigate = useNavigate()

  const [file, setFile] = useState(user?.avatar)

  console.log(file)

  const avatarStyle = {
    // backgroundImage: file ? `url(${URL.createObjectURL(file)})` : `url(${user?.avatar})`,
    width: '80%',
    aspectRatio: '1 / 1',
    margin: 'auto',
    objectFit: 'cover'
  }

  const [fileChanged, setFileChanged] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [imgErrors, setImgErrors] = useState('')
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
  })
  const [firstNameError, setFirstNameError] = useState('')
  const [lastNameError, setLastNameError] = useState('')

  const updateUserMutation = useMutation({
    mutationFn: ({ userId, newUser }) => updateUser(userId, newUser),
    onMutate: () => setSubmitting(true),
    onSuccess: (response) => {
      if (response.token) {
        window.localStorage.setItem('currentUser', JSON.stringify(response))
        setUser(response)
        navigate('/home')
      } else {
        navigate('/error')
        console.log(response)
      }
    },
    onError: (error) => {
      navigate('/error')
      console.error(error)
    }
  })

  const apply = (file) => {
    if (file) {
      setImgErrors(false)
      setFile(file)
      setFileChanged(true)
    }
  }

  const errorHandler = () => {
    setImgErrors(true)
  }

  const validateFields = () => {
    let noErrors = true

    // set error if any field is empty
    if (formData.firstName === '') {
      setFirstNameError('First name is required.')
      noErrors = false
    }

    if (formData.lastName === '') {
      setLastNameError('Last name is required.')
      noErrors = false
    }

    return noErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (submitting) return

    if (validateFields()) {
      const newUser = new FormData()
      newUser.append('firstName', formData.firstName)
      newUser.append('lastName', formData.lastName)
      newUser.append('avatar', file)
      newUser.append('fileChanged', fileChanged)

      updateUserMutation.mutate({
        userId: user._id,
        newUser
      })
    }

    setSubmitting(false)
  }

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))

    if (e.target.name === 'firstName') setFirstNameError('')
    if (e.target.name === 'lastName') setLastNameError('')

  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h3" mt={3}>
        Update Your Information
      </Typography>

      <Box
        sx={{ mt: 3, width: '85%', mx: 'auto' }}
      >
        <Stack spacing={3} direction='row' alignItems='baseline'>
          <TextField
            error={firstNameError !== ''}
            helperText={firstNameError}
            margin="normal"
            required
            id="firstName"
            label="First Name"
            name="firstName"
            value={formData.firstName}
            autoComplete="given-name"
            onChange={handleChange}
          />
          <TextField
            error={lastNameError !== ''}
            helperText={lastNameError}
            margin="normal"
            required
            id="lastName"
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            autoComplete="family-name"
            onChange={handleChange}
          />
        </Stack>

        <Typography gutterBottom variant="h6" mt={3}>
          Set Avatar
        </Typography>
        <Box sx={avatarStyle}>
          <AvatarImageCropper apply={apply} errorHandler={errorHandler} isBack={true} maxsize={1000000}/>
        </Box>
        {
          imgErrors &&
          <Typography variant="subtitle2" color="error" sx={{ marginTop: 1 }}>
          File must be less than 1MB.
          </Typography>
        }


        <Button
          onClick={handleSubmit}
          fullWidth
          variant="contained"
          sx={{ mt: 6, mb: 2 }}
        >
          {
            submitting ? (
              <CircularProgress color="inherit" size="1rem" sx={{ margin: '4px' }} />
            ) : 'Update'
          }
        </Button>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => navigate(-1)}
        >
            Go Back
        </Button>
      </Box>
    </Container>
  )
}

export default UserPage