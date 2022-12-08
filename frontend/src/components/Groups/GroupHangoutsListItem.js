import { Link } from 'react-router-dom'

import Box from '@mui/material/Box'
import { useCurrentUser } from '../../utils/userHooks'
import { Typography, Paper } from '@mui/material'

const GroupHangoutsListItem = ({ hangout }) => {
  const { user } = useCurrentUser()

  // temp
  const showInfo = () => {
    if (user._id === hangout.planner._id ) {
      return <Typography sx={{ color: 'darkgreen', fontWeight: 700 }} variant="subtitle1"> You are planner!</Typography>
    }

    if (hangout.attendees.includes(user._id)) {
      return <Typography sx={{ color: 'blue', fontWeight: 700 }} variant="subtitle1"> You are going!</Typography>
    }

  }

  return (
    <Paper elevation={3} sx={{ width: 500, p: 2, mb: 4 }} >
      <Link to={`./hangouts/${hangout.path}`}>
        <Typography variant="h6" >
          {hangout.title}
        </Typography>
      </Link>
      <Typography variant="subtitle1" >
        {hangout.description}
      </Typography>

      { showInfo() }
    </Paper>
  )
}

export default GroupHangoutsListItem