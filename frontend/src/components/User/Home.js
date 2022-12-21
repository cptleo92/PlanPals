import { getMyGroups, getMyHangouts } from '../../utils/apiHelper'
import { useQuery } from '@tanstack/react-query'
import { useCurrentUser } from '../../utils/hooks'

import HomeSelector from './HomeSelector'

import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'


const Home = () => {
  const { user } = useCurrentUser()
  const navigate = useNavigate()

  const groupsQuery = useQuery(['myGroups', user._id], getMyGroups)
  const hangoutsQuery = useQuery(['myHangouts', user._id], getMyHangouts)

  const userGroups = groupsQuery.data
  const userHangouts = hangoutsQuery.data

  if (groupsQuery.error || hangoutsQuery.error) {
    navigate('/error')
  }

  return (
    groupsQuery.isLoading || hangoutsQuery.isLoading
      ?
      <>
        <Skeleton variant="text" sx={{
          marginTop: 1,
          height: '90px',
          width: '70%'
        }} />
        <Skeleton variant="rounded" sx={{
          height: '40px',
          width: '80%'
        }} />
        <Skeleton variant="rounded" sx={{
          marginY: 3,
          height: '50vh',
          width: '100%'
        }} />
      </>
      :
      <>
        <Typography gutterBottom variant="h3" component="h2" mt={3}>
          Hello there, {user.name}!
        </Typography>
        <HomeSelector userGroups={userGroups} userHangouts={userHangouts} />
      </>

  )
}

export default Home
