
import { useCurrentUser } from '../../utils/hooks'
import { Link, useNavigate } from 'react-router-dom'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import NotificationBell from './NotificationBell'

export default function Navbar({ landing }) {
  const navigate = useNavigate()

  const { user, logoutUser } = useCurrentUser()

  const handleUserNav = (e) => {
    navigate(`/${e.target.name}`)
  }



  const userButtons = () => {
    if (user) {
      return (
        <Box sx={{
          minWidth: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>

          <NotificationBell />

          <Avatar sx={{ width: 35, height: 35, mr: -1 }}>
          </Avatar>

          <Button name="logout" color="inherit" onClick={logoutUser}>Logout</Button>
        </Box>
      )
    }
    return (
      <Box sx={{ minWidth: 200 }}>
        <Button sx={{ marginRight: 4 }} name="login" variant="outlined" color="inherit" onClick={handleUserNav}>Log In</Button>
        <Button name="register" variant="contained" onClick={handleUserNav}>Register</Button>
      </Box>
    )
  }

  return (
    <Box sx={{ flexGrow: 1, minWidth: 300 }}>
      <AppBar position="static" color={ landing ? 'transparent' : 'primary' } elevation={landing ? 0 : 1}>
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ fontFamily: 'Reem Kufi', fontWeight: 500 }}>
            <Link to="/">Plan</Link>
          </Typography>
          <Typography variant="h5" component="div" color={ landing ? 'secondary' : 'inherit' } sx={{ marginRight: 'auto', fontFamily: 'Reem Kufi', fontWeight: 500 }}>
            <Link to="/">Pals</Link>
          </Typography>
          { userButtons() }
        </Toolbar>
      </AppBar>
    </Box>
  )
}
