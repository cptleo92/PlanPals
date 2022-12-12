import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getGroup } from '../../utils/apiHelper'
import { useCurrentUser } from '../../utils/userHooks'
import Loading from '../Misc/Loading'
import GroupHangoutsList from './GroupHangoutsList'

import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import BackArrow from '../Misc/BackArrow'

const linkStyle = {
  fontWeight: 500,
  color: 'blue',
  textDecoration: 'underline',
}

const GroupPage = () => {
  const { user } = useCurrentUser()
  const { groupPath } = useParams()
  const navigate = useNavigate()

  const { isLoading, error, data: group } = useQuery(['group', groupPath], () =>
    getGroup(groupPath)
  )

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
    return members.map(mem => <Avatar key={mem._id}>{mem.name[0]}</Avatar>)
  }

  const isAdmin = () => {
    return user._id === group.admin._id
  }

  return (
    <Box mt={3}>
      <BackArrow link={'/home'}/>
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
        src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&w=350&dpr=2"
      />

      <Typography gutterBottom variant="subtitle1" mt={3}>
        {group?.description}
      </Typography>

      <Typography gutterBottom variant="h5" mt={6} mb={3}>
        Members ({members.length})
      </Typography>


      <Stack direction="row" spacing={2}>
        <Avatar sx={{ width: 75, height: 75 }}>{group.admin.name[0]}</Avatar>
        { generateAvatars() }
      </Stack>

      <Typography gutterBottom variant="h5" mt={6}>
        Upcoming Hangouts
      </Typography>

      <GroupHangoutsList hangouts={hangouts} />

      {isAdmin() && (
        <Link style={linkStyle} to="./hangouts/create">
          Host a hangout
        </Link>
      )}
    </Box>
  )
}

export default GroupPage
