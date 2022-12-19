import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getGroup, joinGroup } from '../../utils/apiHelper'
import { useCurrentUser } from '../../utils/hooks'

import Loading from '../Misc/Loading'
import AvatarStack from '../Misc/AvatarStack'
import GroupHangouts from './GroupHangouts'
import placeholder from '../../assets/Placeholder_view_vector.svg'

import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import BackArrow from '../Misc/BackArrow'
import Button from '@mui/material/Button'
import { Container } from '@mui/material'


const GroupPage = () => {
  const { user } = useCurrentUser()
  const { groupPath } = useParams()
  const navigate = useNavigate()

  const {
    isLoading,
    error,
    data: group,
  } = useQuery(['group', groupPath], () => getGroup(groupPath))

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    navigate('/error')
    console.log(error)
  }

  const hangouts = group.hangouts || []
  const members = group.members || []

  const handleJoin = async () => {
    try {
      await joinGroup(group._id)
      navigate(0)
    } catch (error) {
      navigate('/error')
      console.log(error)
    }
  }
  const renderInfo = () => {
    const isMemberOrPlanner = () => {
      if (group.admin._id === user._id) return true

      return group.members.some((mem) => mem._id === user._id)
    }

    if (isMemberOrPlanner()) {
      return (
        <GroupHangouts hangouts={hangouts} />
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
          height: 250,
          maxHeight: { xs: 150, md: 200, lg: 250 },
        }}
        alt="group avatar"
        src={ group.avatar || placeholder}
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
