import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getHangoutByPath } from '../../utils/apiHelper'
import { useCurrentUser } from '../../utils/userHooks'
import Loading from '../Misc/Loading'

import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'

import BackArrow from '../Misc/BackArrow'
import HangoutAttend from './HangoutAttend'

const HangoutPage = () => {
  const { user } = useCurrentUser()
  const { hangoutPath } = useParams()
  const navigate = useNavigate()

  const {
    isLoading,
    error,
    data: hangout,
  } = useQuery(['hangout', hangoutPath], () => getHangoutByPath(hangoutPath))

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    console.log(error)
    navigate('/error')
  }

  const attendees = hangout.attendees

  const generateAvatars = () => {
    return attendees.map((att) => <Avatar key={att._id}>{att.name[0]}</Avatar>)
  }

  return (
    <Box mt={3} sx={{
      display: 'flex',
      flexDirection: 'column'
    }}>
      <BackArrow link={`/groups/${hangout.groupPath}`} />

      <Typography variant="h3" component="h2" mt={3}>
        {hangout?.title}
      </Typography>


      <Typography gutterBottom variant="button" color="text.secondary">
        <LocationOnIcon fontSize='inherit'/> {hangout.location}
      </Typography>

      <Box
        component="img"
        sx={{
          height: 233,
          width: 350,
          maxHeight: { xs: 233, md: 167 },
          maxWidth: { xs: 350, md: 250 },
        }}
        alt="placeholder"
        src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&w=350&dpr=2"
      />

      {
        user._id === hangout.planner._id &&
        <Link to='./edit' style={{ color: 'blue', fontWeight: 500, textDecoration: 'underline' }}>
          Edit hangout details
        </Link>
      }

      <Typography gutterBottom variant="h6" mt={4}>
        Description
      </Typography>
      <Typography gutterBottom variant="subtitle1">
        {hangout?.description}
      </Typography>

      <Typography gutterBottom variant="h5" mt={6} mb={3}>
        Attending ({attendees.length + 1})
      </Typography>

      <Stack direction="row" spacing={2} mb={3}>
        <Avatar sx={{ width: 75, height: 75 }}>
          {hangout.planner.name[0]}
        </Avatar>
        {generateAvatars()}
      </Stack>

      <HangoutAttend
        hangout={hangout}
        isPlanner={user._id === hangout.planner._id}
        isAttending={hangout.attendees.map(att => att._id).includes(user._id)}
      />
    </Box>
  )
}

export default HangoutPage
