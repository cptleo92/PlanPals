import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { registerUser, loginUser, loginUserOauth } from '../../utils/apiHelper'
import { useCurrentUser } from '../../utils/hooks'
import { GoogleLogin } from '@react-oauth/google'

import Navbar from '../Misc/Navbar'

import Avatar from '@mui/material/Avatar'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import CircularProgress from '@mui/material/CircularProgress'


const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  rememberUser: false
}

export default function UserForm() {
  const { groupPath } = useParams()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const { setUser } = useCurrentUser()

  const [formData, setFormData] = useState(emptyForm)

  const [firstNameError, setFirstNameError] = useState('')
  const [lastNameError, setLastNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')

  const [submitting, setSubmitting] = useState(false)

  // returns true if no errors are found
  const validateFields = () => {
    let noErrors = true
    // set error if email is invalid format
    if (!formData.email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
      setEmailError('Email address is invalid.')
      noErrors = false
    }

    // validations specific for registering
    if (pathname.startsWith('/register')) {
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

      // set error if any field is empty
      if (formData.firstName === '') {
        setFirstNameError('First name is required.')
        noErrors = false
      }

      if (formData.lastName === '') {
        setLastNameError('Last name is required.')
        noErrors = false
      }
    }

    if (formData.email === '') {
      setEmailError('Email address is required.')
      noErrors = false
    }

    if (formData.password === '') {
      setPasswordError('Password is required.')
      noErrors = false
    }

    return noErrors
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (submitting) return

    setSubmitting(true)

    if (validateFields()) {
      let response
      if (pathname.startsWith('/login')) {
        response = await loginUser(formData)
      } else {
        response = await registerUser(formData)
      }

      if (
        response === 'User already exists!' ||
        response === 'Invalid credentials.'
      ) {
        setEmailError(response)
      }

      if (response.token) {
        window.localStorage.setItem('currentUser', JSON.stringify(response))
        setUser(response)
        groupPath ? navigate(`/groups/${groupPath}`) : navigate('/home')
      }
    }

    setSubmitting(false)
  }

  // reset everything on switching form type
  useEffect(() => {
    setFormData(emptyForm)
    setFirstNameError('')
    setLastNameError('')
    setEmailError('')
    setPasswordError('')
    setConfirmPasswordError('')
  }, [pathname])

  const renderSwitchType = () => {
    return pathname.startsWith('/login') ? (
      <Link variant="body2" onClick={() => navigate(`/register/${groupPath || ''}`)}>
        "Don't have an account? Sign Up"
      </Link>
    ) : (
      <Link variant="body2" onClick={() => navigate(`/login/${groupPath}`)}>
        "Already have an account? Sign In"
      </Link>
    )
  }

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))

    if (e.target.name === 'firstName') setFirstNameError('')
    if (e.target.name === 'lastName') setLastNameError('')
    if (e.target.name === 'email') setEmailError('')
    if (e.target.name === 'confirmPassword') setConfirmPasswordError('')
    if (e.target.name === 'password') setPasswordError('')
  }

  const handleCheckbox = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      rememberUser: e.target.checked
    }))
  }

  const renderSubmit = () => {
    return (
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        {submitting ? (
          <CircularProgress color="inherit" size="1rem" sx={{ margin: '4px' }} />
        ) : pathname.startsWith('/login') ? (
          'Sign In'
        ) : (
          'Sign Up'
        )}
      </Button>
    )
  }

  /**
   * REMOVE IN PROD!!
   *
   * EDIT: I've decided to leave this in as a demo feature
   */
  const loginTest = async () => {
    let response = await loginUser({
      email: 'test2@test.com',
      password: 'password'
    })

    if (response.token) {
      window.localStorage.setItem('currentUser', JSON.stringify(response))
      setUser(response)
      groupPath ? navigate(`/groups/${groupPath}`) : navigate('/home')
    }

  }

  const handleGoogle = async (token) => {
    try {
      const response = await loginUserOauth(token)

      if (response.token) {
        window.localStorage.setItem('currentUser', JSON.stringify(response))
        setUser(response)
        groupPath ? navigate(`/groups/${groupPath}`) : navigate('/home')
      }

    } catch (error) {
      console.error(error)
    }
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
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main', cursor: 'pointer' }} onClick={loginTest}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography gutterBottom component="h1" variant="h5">
            {pathname.startsWith('/login') ? 'Sign in' : 'Sign up'}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Click on the Lock icon above to log in as a demo user!
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1, width: '100%' }}
          >
            {pathname.startsWith('/register') && (
              <Stack spacing={3} direction='row' alignItems='baseline'>
                <TextField
                  error={firstNameError !== ''}
                  helperText={firstNameError}
                  margin="normal"
                  required
                  autoFocus
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
            )}
            <TextField
              error={emailError !== ''}
              helperText={emailError}
              margin="normal"
              required
              autoFocus
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              value={formData.email}
              autoComplete="email"
              onChange={handleChange}
            />
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
            {pathname.startsWith('/register') && (
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
            )}
            <FormControlLabel
              control={
                <Checkbox
                  value="remember"
                  color="primary"
                  checked={formData.rememberUser}
                  onChange={handleCheckbox}
                />
              }
              label="Remember me"
            />

            {renderSubmit()}

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <GoogleLogin
                onSuccess={(res) => handleGoogle(res)}
                width='100%'
              />
            </Box>


            <Grid container mt={2}>
              <Grid item xs>
                <Link variant="body2" onClick={() => navigate('/passwordReset')}>Forgot password?</Link>
              </Grid>
              <Grid item>{renderSwitchType()}</Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  )
}
