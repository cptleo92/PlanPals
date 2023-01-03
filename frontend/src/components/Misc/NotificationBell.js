import { useState } from 'react'

import Popover from '@mui/material/Popover'
import Box from '@mui/material/Box'
import Badge from '@mui/material/Badge'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import NotificationsIcon from '@mui/icons-material/Notifications'
import IconButton from '@mui/material/IconButton'

import NotificationItem from './NotificationItem'

const testNotifications = [
  'Jason is going to your hangout!.',
  'Jason is going to your hangout!.',
  'Jason is going to your hangout!.',
]

const NotificationBell = () => {
  // menu stuff
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <IconButton onClick={handleClick} >
        <Badge badgeContent={3} color="secondary">
          <NotificationsIcon sx={{ color: 'white' }} />
        </Badge>
      </IconButton>
      <Popover
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{
          // maxWidth: 300
        }}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          p: 1
        }}>
          <Typography variant="subtitle2">
            Notifications
          </Typography>
          <Typography variant="subtitle2">
            See All
          </Typography>
        </Box>

        <Divider />

        {
          testNotifications.map((notif, idx) => (
            <NotificationItem notif={notif} key={idx} />
          ))
        }

      </Popover>
    </>
  )
}

export default NotificationBell