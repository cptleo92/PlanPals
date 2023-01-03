import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { lightBlue } from '@mui/material/colors'

const NotificationItem = ({ notif }) => {
  return (
    <Box sx={{
      // width: '100%',
      margin: 1,
      padding: 1,
      borderRadius: 1,
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: lightBlue[50],
      }
    }}>

      <Typography variant="body2">
        {notif}
      </Typography>
    </Box>
  )
}

export default NotificationItem