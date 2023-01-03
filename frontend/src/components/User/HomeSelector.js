import { useState } from 'react'
import HomeGroups from './HomeGroups'
import HangoutsList from '../Hangouts/HangoutsList'
import { splitHangouts } from '../../utils/hangouts'

import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import useMediaQuery from '@mui/material/useMediaQuery'

const HomeSelector = ({ userGroups, userHangouts }) => {
  const [displayType, setDisplayType] = useState('groups')

  const { pastHangouts, pendingHangouts, upcomingHangouts } = splitHangouts(userHangouts)

  const handleChange = (event, newDisplayType) => {
    if (newDisplayType !== null) {
      setDisplayType(newDisplayType)
    }
  }

  const isSmall = useMediaQuery('(max-width:600px)')

  const renderListType = () => {
    if (displayType === 'groups') {
      return <HomeGroups userGroups={userGroups} />
    } else if (displayType === 'pendingHangouts') {
      return <HangoutsList hangouts={pendingHangouts} />
    } else if (displayType === 'upcomingHangouts') {
      return <HangoutsList hangouts={upcomingHangouts} />
    } else if (displayType === 'pastHangouts') {
      return <HangoutsList hangouts={pastHangouts} past/>
    }
  }

  return (
    <>
      <ToggleButtonGroup
        color="primary"
        value={displayType}
        exclusive
        onChange={handleChange}
        sx={{ marginBottom: 2 }}
        orientation={isSmall ? 'vertical' : 'horizontal'}
        fullWidth={isSmall ? true : false }
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

export default HomeSelector