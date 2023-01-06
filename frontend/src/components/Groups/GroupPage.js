import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getGroup, joinGroup } from '../../utils/apiHelper'
import { useCurrentUser } from '../../utils/hooks'
import placeholder from '../../assets/Placeholder_view_vector.svg'

import AvatarStack from '../Misc/AvatarStack'
import GroupHangouts from './GroupHangouts'
import PageSkeleton from '../Misc/PageSkeleton'

import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import BackArrow from '../Misc/BackArrow'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'


const GroupPage = () => {
  const { user } = useCurrentUser()
  const { groupPath } = useParams()
  const navigate = useNavigate()

  const [submitting, setSubmitting] = useState(false)

  const {
    isLoading,
    error,
    data: group,
  } = useQuery(['group', groupPath], () => getGroup(groupPath))

  if (isLoading) {
    return <PageSkeleton />
  }

  if (error) {
    navigate('/error')
    console.log(error)
  }


  const handleJoin = async () => {
    setSubmitting(true)
    try {
      await joinGroup(group._id)
      navigate(0)
    } catch (error) {
      navigate('/error')
      console.log(error)
    }
  }

  // const handleLeave = async () => {
  //   try {
  //     await leaveGroup(group._id)
  //     navigate(0)
  //   } catch (error) {
  //     navigate('/error')
  //     console.log(error)
  //   }
  // }

  const renderInfo = () => {
    const isMemberOrPlanner = () => {
      if (group.admin._id === user._id) return true

      return group.members.some((mem) => mem._id === user._id)
    }

    if (isMemberOrPlanner()) {
      return (
        <>
          <GroupHangouts hangouts={group.hangouts} />
          {/* <Button onClick={handleLeave}>Leave</Button> */}
        </>
      )
    } else {
      return (
        <Button
          sx={{ marginY: 3 }}
          variant="contained"
          color="secondary"
          onClick={handleJoin}
          disabled={submitting}
        >
          Join Group
        </Button>
      )
    }
  }

  return (
    <Container sx={{ mt: 3 }}>
      <BackArrow link={'/home'} />
      <Typography variant="h3" component="h2" mt={3} mb={6}>
        {group?.title}
      </Typography>

      <Box
        component="img"
        sx={{
          height: 'auto',
          maxHeight: 300,
          maxWidth: '100%'
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

      <Container sx={{ marginLeft: 0 }} disableGutters>
        <Typography gutterBottom variant="h5" mt={6} mb={3}>
        Members ({group.members.length + 1})
        </Typography>

        <AvatarStack
          peopleList={group.members}
          admin={group.admin}
        />

        {renderInfo()}
      </Container>

    </Container>
  )
}

export default GroupPage
