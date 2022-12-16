import { useNavigate } from 'react-router-dom'
import { useCurrentUser } from '../../utils/hooks'
import { parseDate } from '../../utils/date'
import { getUser } from '../../utils/apiHelper'
import { useQuery } from '@tanstack/react-query'
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

const HangoutsListItem = ({ hangout, past }) => {
  const { user } = useCurrentUser()
  const navigate = useNavigate()

  const isPlanner = user._id === hangout.planner
  const isAttending = hangout.attendees.includes(user._id)

  const {
    error,
    isLoading,
    data: planner,
  } = useQuery({
    queryKey: ['planner', hangout.planner],
    queryFn: () => getUser(hangout.planner),
  })

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

  return (
    isLoading
      ? <Skeleton variant="rectangular" sx={{ width: 500, height: 150, marginBottom: 3 }} />
      :
      (<Card
        sx={{
          display: 'flex',
          marginBottom: 3,
          width: 500,
          height: 150,
          cursor: 'pointer',
          position: 'relative',
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
            width: '70%',
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
            <Person fontSize="inherit" /> {planner.name}
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
