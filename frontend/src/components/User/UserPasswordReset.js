import { useState } from 'react'

import Navbar from '../Misc/Navbar'

import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Avatar from '@mui/material/Avatar'
import CircularProgress from '@mui/material/CircularProgress'
import Button from '@mui/material/Button'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { forgotPassword } from '../../utils/apiHelper'

const UserPasswordReset = () => {
  const [ emailError, setEmailError ] = useState('')
  const [ email, setEmail ] = useState('')
  const [ submitting, setSubmitting ] = useState(false)
  const [ success, setSuccess ] = useState(false)

  const handleChange = (e) => {
    setEmailError('')
    setEmail(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return

    if (!email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
      setEmailError('Email address is invalid.')
    } else {
      setSubmitting(true)

      const response = await forgotPassword({ email })

      if (response.success === 'true') {
        setSuccess(true)
      } else {
        setEmailError('User does not exist.')
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
            success
              ?
              <Typography gutterBottom variant="h4">
                Please check your email for reset instructions!
              </Typography>
              :
              <>
                <Typography gutterBottom variant="h4">
            Reset your password.
                </Typography>

                <Typography gutterBottom variant="subtitle1" color="text.secondary">
            Enter your email address below.
                </Typography>

                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  noValidate
                  sx={{ mt: 1 }}
                >
                  <TextField
                    error={emailError !== ''}
                    helperText={emailError}
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    value={email}
                    autoComplete="email"
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

export default UserPasswordReset