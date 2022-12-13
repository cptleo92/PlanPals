import { useNavigate } from 'react-router-dom'
import { useCurrentUser } from '../../utils/userHooks'
import { parseDate } from '../../utils/date'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import DateRangeIcon from '@mui/icons-material/DateRange'
import StarIcon from '@mui/icons-material/Star'
import Tooltip from '@mui/material/Tooltip'

const GroupHangoutsListItem = ({ hangout }) => {
  const { user } = useCurrentUser()
  const navigate = useNavigate()

  const isPlanner = user._id === hangout.planner
  const isAttending = hangout.attendees.includes(user._id)

  // temp
  const showInfo = () => {
    if (isPlanner) {
      return (
        <Typography
          sx={{ color: 'darkgreen', fontWeight: 700 }}
          variant="subtitle1"
        >
          {' '}
          You are the planner!
        </Typography>
      )
    }

    if (isAttending) {
      return (
        <Typography sx={{ color: 'blue', fontWeight: 700 }} variant="subtitle1">
          {' '}
          You are going!
        </Typography>
      )
    }
  }

  const getDate = () => {
    return hangout.finalized
      ?  parseDate(hangout.finalDate)
      : 'Pending'
  }

  const handleClick = () => {
    navigate(`/groups/${hangout.groupPath}/hangouts/${hangout.path}`)
  }

  return (
    <Card
      sx={{
        display: 'flex',
        marginBottom: 3,
        width: 450,
        height: 140,
        cursor: 'pointer',
      }}
      onClick={handleClick}
    >
      <CardMedia
        component="img"
        sx={{ width: 151 }}
        image="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&w=350&dpr=2"
        alt="placeholder"
      />
      {isPlanner && (
        <Tooltip title="You are the planner!">
          <StarIcon sx={{ color: 'orange', position: 'absolute' }} />
        </Tooltip>
      )}

      <Box
        p={1}
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography noWrap variant="h6">
          {hangout.title}
        </Typography>

        <Typography variant="button" color="text.secondary">
          <LocationOnIcon fontSize="inherit" /> {hangout.location}
        </Typography>

        <Typography gutterBottom variant="button" color="text.secondary">
          <DateRangeIcon fontSize="inherit" /> {getDate()}
        </Typography>
        {showInfo()}
      </Box>
    </Card>
  )
}

export default GroupHangoutsListItem
