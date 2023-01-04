import { useEffect, useState } from 'react'
import { useCurrentUser } from '../../utils/hooks'
import { useQuery } from '@tanstack/react-query'

import Popover from '@mui/material/Popover'
import Box from '@mui/material/Box'
import Badge from '@mui/material/Badge'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import NotificationsIcon from '@mui/icons-material/Notifications'
import IconButton from '@mui/material/IconButton'

import NotificationItem from './NotificationItem'
import { getUserNotifications, markNotificationsRead } from '../../utils/apiHelper'

const NotificationBell = () => {
  // menu stuff
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    markNotificationsRead(user._id, notifications)
    setBadgeContent(0)
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const { user } = useCurrentUser()
  const [badgeContent, setBadgeContent] = useState(null)

  const {
    isLoading,
    data: notifications,
  } = useQuery(['notifs', user._id], async () => {
    const notifs = await getUserNotifications(user._id)
    let count = 0

    for (let notif of notifs) {
      if (notif.unread === 'true') count++
    }

    setBadgeContent(count)
    return notifs
  }
  )

  return (
    <>
      <IconButton onClick={handleClick} >
        <Badge badgeContent={isLoading ? null : badgeContent} color="secondary">
          <NotificationsIcon sx={{ color: 'white' }} />
        </Badge>
      </IconButton>

      <Popover
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        // sx={{
        //   minWidth: 600
        // }}
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
          p: 2,
          width: 350,
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
          notifications?.map((notif, idx) => (
            <NotificationItem notif={notif} key={idx} />
          ))
        }

      </Popover>
    </>
  )
}

export default NotificationBell