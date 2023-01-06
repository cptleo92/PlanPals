import { useState } from 'react'
import { useCurrentUser } from '../../utils/hooks'
import { useQuery } from '@tanstack/react-query'
import { getUserNotifications, markNotificationsRead } from '../../utils/apiHelper'
import { Link, useNavigate } from 'react-router-dom'
import { useMediaQuery } from '@mui/material'

import Popover from '@mui/material/Popover'
import Box from '@mui/material/Box'
import Badge from '@mui/material/Badge'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import NotificationsIcon from '@mui/icons-material/Notifications'
import IconButton from '@mui/material/IconButton'

import NotificationItem from './NotificationItem'

const NotificationBell = () => {
  const navigate = useNavigate()

  // menu stuff
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    if (isSmall) {
      setBadgeContent(0)
      navigate('/notifications')
    } else {
      setAnchorEl(event.currentTarget)
    }

  }
  const handleClose = () => {
    markNotificationsRead(user._id, notifications)
    setBadgeContent(0)
    setAnchorEl(null)
  }

  const { user } = useCurrentUser()
  const [badgeContent, setBadgeContent] = useState(null)

  const isSmall = useMediaQuery('(max-width:600px)')

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

  // truncate notifs
  const slicedNotifs = notifications?.slice(0, 8)

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
          minWidth: 400,
        }}>

          <Typography px={3} py={2} variant="h6">
            Notifications
          </Typography>

          <Divider />

          {
            slicedNotifs?.map((notif, idx) => (
              <NotificationItem notif={notif} key={idx} />
            ))
          }

          {
            notifications?.length > 8 &&
            <>
              <Divider variant='middle' />
              <Link to="/notifications" onClick={handleClose}>
                <Typography m={1} textAlign='center' variant='subtitle2' color='text.disabled' sx={{
                  '&:hover': {
                    color: 'text.primary'
                  }
                }}>
                  See All
                </Typography>
              </Link>
            </>
          }

        </Box>
      </Popover>
    </>
  )
}

export default NotificationBell