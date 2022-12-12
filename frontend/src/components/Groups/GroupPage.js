import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getGroup, joinGroup } from '../../utils/apiHelper'
import { useCurrentUser } from '../../utils/userHooks'
import Loading from '../Misc/Loading'
import GroupHangoutsList from './GroupHangoutsList'

import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import BackArrow from '../Misc/BackArrow'
import { Button } from '@mui/material'

const linkStyle = {
  fontWeight: 500,
  color: 'blue',
  textDecoration: 'underline',
}

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

  console.log(group)

  if (error) {
    console.log(error)
    navigate('/error')
  }

  const hangouts = group.hangouts
  const members = group.members

  const generateAvatars = () => {
    return members.map((mem) => <Avatar key={mem._id}>{mem.name[0]}</Avatar>)
  }

  const isAdmin = () => {
    return user._id === group.admin._id
  }

  console.log(user)
  const handleJoin = async () => {
    try {
      await joinGroup(group._id)
      navigate(0)
    } catch (error) {
      console.log(error)
      navigate('/error')
    }
  }

  const renderInfo = () => {
    const isMemberOrPlanner = () => {
      if (group.admin._id === user._id) return true

      return group.members.some((mem) => mem._id === user._id)
    }

    if (isMemberOrPlanner()) {
      return (
        <>
          <Typography gutterBottom variant="h5" mt={6}>
            Upcoming Hangouts
          </Typography>

          <GroupHangoutsList hangouts={hangouts} />

          {isAdmin() && (
            <Link style={linkStyle} to="./hangouts/create">
              Host a hangout
            </Link>
          )}
        </>
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

      <Typography gutterBottom variant="h5" mt={6} mb={3}>
        Members ({members.length + 1})
      </Typography>

      <Stack direction="row" spacing={2}>
        <Avatar sx={{ width: 75, height: 75 }}>{group.admin.name[0]}</Avatar>
        {generateAvatars()}
      </Stack>

      {renderInfo()}
    </Box>
  )
}

export default GroupPage
