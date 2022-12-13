import { useState } from 'react'
import { getMyGroups, getMyHangouts } from '../../utils/apiHelper'
import { useQuery } from '@tanstack/react-query'
import { useCurrentUser } from '../../utils/hooks'
import { splitHangouts } from '../../utils/hangouts'
import HomeGroups from './HomeGroups'
import GroupHangoutsList from '../Groups/GroupHangoutsList'
import Loading from '../Misc/Loading'
import Error from '../Misc/Error'

import Typography from '@mui/material/Typography'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'

const Home = () => {
  const [displayType, setDisplayType] = useState('groups')

  const { user } = useCurrentUser()
  const groupsQuery = useQuery(['myGroups', user._id], getMyGroups)
  const hangoutsQuery = useQuery(['myHangouts', user._id], getMyHangouts)

  const userGroups = groupsQuery.data
  const userHangouts = hangoutsQuery.data


  if (groupsQuery.isLoading || hangoutsQuery.isLoading) {
    return <Loading />
  }
  const { pastHangouts, pendingHangouts, upcomingHangouts } = splitHangouts(userHangouts)

  if (groupsQuery.error || hangoutsQuery.error) return <Error />

  const handleChange = (event, newDisplayType) => {
    if (newDisplayType !== null) {
      setDisplayType(newDisplayType)
    }
  }


  const renderListType = () => {
    if (displayType === 'groups') {
      return <HomeGroups userGroups={userGroups} />
    } else if (displayType === 'pendingHangouts') {
      return <GroupHangoutsList hangouts={pendingHangouts} />
    } else if (displayType === 'upcomingHangouts') {
      return <GroupHangoutsList hangouts={upcomingHangouts} />
    } else if (displayType === 'pastHangouts') {
      return <GroupHangoutsList hangouts={pastHangouts} />
    }
  }

  return (
    <>
      <Typography gutterBottom variant="h3" component="h2" mt={3}>
        Hello there, {user?.name}!
      </Typography>

      <ToggleButtonGroup
        color="primary"
        value={displayType}
        exclusive
        onChange={handleChange}
        sx={{ marginBottom: 2 }}
      >
        <ToggleButton value="groups">My Groups</ToggleButton>
        <ToggleButton value="pendingHangouts">My Pending Hangouts</ToggleButton>
        <ToggleButton value="upcomingHangouts">My Upcoming Hangouts</ToggleButton>
        <ToggleButton value="pastHangouts">My Past Hangouts</ToggleButton>
      </ToggleButtonGroup>

      { renderListType() }
    </>
  )
}

export default Home
