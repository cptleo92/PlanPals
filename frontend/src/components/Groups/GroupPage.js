import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getGroup, joinGroup } from '../../utils/apiHelper'
import { splitHangouts } from '../../utils/hangouts'
import { useCurrentUser } from '../../utils/hooks'
import Loading from '../Misc/Loading'
import GroupHangoutsList from './GroupHangoutsList'

import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import BackArrow from '../Misc/BackArrow'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Button from '@mui/material/Button'
import { Container } from '@mui/material'
import HangoutForm from '../Hangouts/HangoutForm'
import AvatarStack from '../Misc/AvatarStack'

const GroupPage = () => {
  const { user } = useCurrentUser()
  const { groupPath } = useParams()
  const navigate = useNavigate()

  const [displayType, setDisplayType] = useState('pendingHangouts')

  const {
    isLoading,
    error,
    data: group,
  } = useQuery(['group', groupPath], () => getGroup(groupPath))

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    console.log(error)
    navigate('/error')
  }

  const hangouts = group.hangouts
  const members = group.members
  const { pastHangouts, pendingHangouts, upcomingHangouts } = splitHangouts(hangouts)

  const handleJoin = async () => {
    try {
      await joinGroup(group._id)
      navigate(0)
    } catch (error) {
      console.log(error)
      navigate('/error')
    }
  }

  const handleChange = (event, newDisplayType) => {
    if (newDisplayType !== null) {
      setDisplayType(newDisplayType)
    }
  }

  const renderListType = () => {
    if (displayType === 'pendingHangouts') {
      return <GroupHangoutsList hangouts={pendingHangouts} />
    } else if (displayType === 'upcomingHangouts') {
      return <GroupHangoutsList hangouts={upcomingHangouts} />
    } else if (displayType === 'pastHangouts') {
      return <GroupHangoutsList hangouts={pastHangouts} past />
    } else if (displayType === 'newHangout') {
      return <HangoutForm />
    }
  }

  const renderInfo = () => {
    const isMemberOrPlanner = () => {
      if (group.admin._id === user._id) return true

      return group.members.some((mem) => mem._id === user._id)
    }

    if (isMemberOrPlanner()) {
      return (
        <Box mt={4}>
          <ToggleButtonGroup
            color="primary"
            value={displayType}
            exclusive
            onChange={handleChange}
            sx={{ marginBottom: 2 }}
          >
            <ToggleButton value="pendingHangouts">Pending Hangouts</ToggleButton>
            <ToggleButton value="upcomingHangouts">Upcoming Hangouts</ToggleButton>
            <ToggleButton value="pastHangouts">Past Hangouts</ToggleButton>
            <ToggleButton value="newHangout" color="success">

                Plan a new hangout!

            </ToggleButton>
          </ToggleButtonGroup>
          { renderListType() }
        </Box>
      )
    } else {
      return (
        <Button
          sx={{ marginY: 3 }}
          variant="contained"
          color="secondary"
          onClick={handleJoin}
        >
          Join Group
        </Button>
      )
    }
  }

  return (
    <Box mt={3}>
      <BackArrow link={'/home'} />
      <Typography variant="h3" component="h2" mt={3} mb={6}>
        {group?.title}
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
        src="https://placebear.com/400/233"
      />
      <br />
      {user._id === group.admin._id && (
        <Link
          to="./edit"
          style={{
            color: 'blue',
            fontWeight: 500,
            textDecoration: 'underline',
          }}
        >
          Edit group details
        </Link>
      )}

      <Typography gutterBottom variant="h6" mt={4}>
        Description
      </Typography>
      <Typography gutterBottom variant="subtitle1" mt={3}>
        {group?.description}
      </Typography>

      <Container sx={{ marginLeft: 0 }} disableGutters maxWidth="sm">
        <Typography gutterBottom variant="h5" mt={6} mb={3}>
        Members ({members.length + 1})
        </Typography>

        <AvatarStack
          peopleList={group.members}
          admin={group.admin}
        />

        {renderInfo()}
      </Container>
    </Box>
  )
}

export default GroupPage
