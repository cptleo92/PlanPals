import { useNavigate } from 'react-router-dom'
import { useCurrentUser } from '../../utils/hooks'
import { parseDate } from '../../utils/date'
import { getHangoutByPath } from '../../utils/apiHelper'
import { useQuery } from '@tanstack/react-query'
import placeholder from '../../assets/Placeholder_view_vector.svg'

import Skeleton from '@mui/material/Skeleton'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import DateRangeIcon from '@mui/icons-material/DateRange'
import StarIcon from '@mui/icons-material/Star'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import Tooltip from '@mui/material/Tooltip'
import Person from '@mui/icons-material/Person'
import PeopleIcon from '@mui/icons-material/People'
import useMediaQuery from '@mui/material/useMediaQuery'

const HangoutsListItem = ({ hangoutPath, past }) => {
  const { user } = useCurrentUser()
  const navigate = useNavigate()

  const { error, isLoading, data: hangout } = useQuery(['hangout', hangoutPath], () => getHangoutByPath(hangoutPath))

  if (error) {
    navigate('/error')
    console.log(error)
  }

  const getDate = () => {
    let date = hangout.finalized ? parseDate(hangout.finalDate) : 'Pending'
    let color = hangout.finalized ? 'success.main' : 'text.secondary'

    if (past) color = 'text.disabled'

    return (
      <Typography variant="button" color={color}>
        <DateRangeIcon fontSize="inherit" /> {date}
      </Typography>
    )

  }

  const handleClick = () => {
    navigate(`/groups/${hangout.groupPath}/hangouts/${hangout.path}`)
  }

  const isPlanner = user._id === hangout?.planner._id
  const isAttending = hangout?.attendees.map(att => att._id).includes(user._id)

  const isSmall = useMediaQuery('(max-width:600px)')

  return (
    isLoading
      ? <Skeleton variant="rectangular" sx={{ width: isSmall ? '80%' : 500, height: 150, marginBottom: 3 }} />
      :
      (<Card
        sx={{
          display: 'flex',
          marginBottom: 3,
          width: isSmall ? '80%' : 500,
          height: 150,
          cursor: 'pointer',
          position: 'relative',
        }}
        onClick={handleClick}
      >
        {
          !isSmall &&
          <CardMedia
            component="img"
            sx={{ width: 151 }}
            image={ hangout.avatar || placeholder }
            alt="hangout avatar"
          />
        }
        {isPlanner && (
          <Tooltip title="You are the planner!">
            <StarIcon
              sx={{
                color: 'orange',
                position: 'absolute',
                right: 10,
                bottom: 10,
                fontSize: '32px',
              }}
            />
          </Tooltip>
        )}
        {isAttending && (
          <Tooltip title="You are attending!">
            <CheckCircleIcon
              sx={{
                color: 'green',
                position: 'absolute',
                right: 10,
                bottom: 10,
                fontSize: '32px',
              }}
            />
          </Tooltip>
        )}

        <Box
          p={1}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: isSmall ? '100%' : '70%',
            justifyContent: 'space-between'
          }}
        >
          <Typography noWrap variant="h6" color={past ? 'text.disabled' : 'text.primary'}>
            {hangout.title}
          </Typography>

          <Typography variant="button" color={past ? 'text.disabled' : 'text.primary'}>
            <LocationOnIcon fontSize="inherit" /> {hangout.location}
          </Typography>

          { getDate() }

          <Typography variant="subtitle2" color={past ? 'text.disabled' : 'text.primary'}>
            <Person fontSize="inherit" /> {hangout.planner.firstName} {hangout.planner.lastName}
          </Typography>
          <Typography variant="button" color={past ? 'text.disabled' : 'text.primary'}>
            <PeopleIcon fontSize="inherit" /> {hangout.attendees.length + 1}
          </Typography>
        </Box>
      </Card>
      )
  )
}

export default HangoutsListItem
