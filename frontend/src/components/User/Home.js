import { getMyGroups, getMyHangouts } from '../../utils/apiHelper'
import { useQuery } from '@tanstack/react-query'
import { useCurrentUser } from '../../utils/hooks'

import HomeSelector from './HomeSelector'
import Loading from '../Misc/Loading'
import Error from '../Misc/Error'

import Typography from '@mui/material/Typography'


const Home = () => {
  const { user } = useCurrentUser()

  const groupsQuery = useQuery(['myGroups', user._id], getMyGroups)
  const hangoutsQuery = useQuery(['myHangouts', user._id], getMyHangouts)

  const userGroups = groupsQuery.data
  const userHangouts = hangoutsQuery.data

  if (groupsQuery.isLoading || hangoutsQuery.isLoading) {
    return <Loading />  }


  if (groupsQuery.error || hangoutsQuery.error) return <Error />

  return (
    <>
      <Typography gutterBottom variant="h3" component="h2" mt={3}>
        Hello there, {user?.name}!
      </Typography>
      <HomeSelector userGroups={userGroups} userHangouts={userHangouts} />
    </>
  )
}

export default Home
