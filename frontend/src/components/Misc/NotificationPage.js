import { useQuery } from '@tanstack/react-query'
import { useCurrentUser } from '../../utils/hooks'
import { getUserNotifications, markNotificationsRead } from '../../utils/apiHelper'

import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'

import NotificationItem from './NotificationItem'

const NotificationPage = () => {
  const { user } = useCurrentUser()

  const {
    isLoading,
    data: notifications,
  } = useQuery(['notifs', user._id],  () => getUserNotifications(user._id))

  setTimeout(() => {
    markNotificationsRead(user._id, notifications)
  }, 2000)

  return (
    <Container maxWidth='sm'>
      <Typography gutterBottom variant="h3" component="h2" mt={3}>
          Notifications
      </Typography>

      {
        !isLoading &&
        notifications.map((notif, idx) => (
          <NotificationItem notif={notif} key={idx} />
        ))
      }
    </Container>
  )
}

export default NotificationPage