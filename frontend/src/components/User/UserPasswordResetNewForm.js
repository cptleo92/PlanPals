import { useState } from 'react'
import { useParams } from 'react-router-dom'

import Navbar from '../Misc/Navbar'

import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Avatar from '@mui/material/Avatar'
import CircularProgress from '@mui/material/CircularProgress'
import Button from '@mui/material/Button'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { resetPassword } from '../../utils/apiHelper'

const UserPasswordResetNewForm = () => {
  const { token, id } = useParams()

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')

  const [submitting, setSubmitting] = useState(false)

  const [confirmation, setConfirmation] = useState(false)
  const [confirmationMessage, setConfirmationMessage] = useState('Your password has been successfully reset! Please log back in.')

  const validateFields = () => {
    let noErrors = true

    // set error if passowrds do not match
    if (formData.password !== formData.confirmPassword) {
      setConfirmPasswordError('Passwords do not match.')
      noErrors = false
    }

    // set error if password is too short
    if (formData.password.length < 6) {
      setPasswordError('Password must be at least 6 characters.')
      noErrors = false
    }

    if (formData.password === '') {
      setPasswordError('Password is required.')
      noErrors = false
    }

    return noErrors
  }

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))

    if (e.target.name === 'confirmPassword') setConfirmPasswordError('')
    if (e.target.name === 'password') setPasswordError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (submitting) return

    setSubmitting(true)

    if (validateFields()) {
      const resetData = {
        password: formData.password,
        token,
        id
      }

      const response = await resetPassword(resetData)

      if (response.success === 'true') {
        setConfirmation(true)
      } else {
        setConfirmation(true)
        setConfirmationMessage('Something went wrong! Your token is invalid. Please try again.')
      }

    }

    setSubmitting(false)
  }

  return (
    <>
      <Navbar landing />
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>

          {
            confirmation
              ?
              <Typography gutterBottom variant="h4">
                {confirmationMessage}
              </Typography>
              :
              <>
                <Typography gutterBottom variant="h4">
            Reset your password.
                </Typography>

                <Typography gutterBottom variant="subtitle1" color="text.secondary">
            Enter your new password below.
                </Typography>

                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  noValidate
                  sx={{ mt: 1 }}
                >
                  <TextField
                    error={passwordError !== ''}
                    helperText={passwordError}
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    value={formData.password}
                    autoComplete="current-password"
                    onChange={handleChange}
                  />

                  <TextField
                    error={confirmPasswordError !== ''}
                    helperText={confirmPasswordError}
                    margin="normal"
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />


                  <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                    {
                      submitting ? (
                        <CircularProgress color="inherit" size="1rem" sx={{ margin: '4px' }}/>
                      ) : 'Submit'
                    }
                  </Button>
                </Box>
              </>
          }
        </Box>
      </Container>
    </>
  )
}

export default UserPasswordResetNewForm