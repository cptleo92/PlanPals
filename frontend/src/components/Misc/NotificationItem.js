import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { lightBlue } from '@mui/material/colors'
import { useNavigate } from 'react-router-dom'
import { daysAgo } from '../../utils/date'



const NotificationItem = ({ notif }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(notif.href)
  }

  return (
    <Box sx={{
      width: 350,
      margin: 1,
      padding: 2,
      borderRadius: 1,
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: lightBlue[50],
      }
    }}
    onClick={handleClick}
    >
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <Typography variant="body2" >
          <strong>{notif.user}</strong> {notif.text}
        </Typography>
        <Typography variant="caption" color="primary">
          {daysAgo(notif.creationDate)}
        </Typography>
      </Box>
      <Typography variant="caption" color="text.secondary">
        {notif.subject}
      </Typography>
    </Box>
  )
}

export default NotificationItem