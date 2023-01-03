import { useState } from 'react'
import { splitHangouts } from '../../utils/hangouts'

import HangoutForm from '../Hangouts/HangoutForm'
import HangoutsList from '../Hangouts/HangoutsList'

import useMediaQuery from '@mui/material/useMediaQuery'
import Box from '@mui/material/Box'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'

const GroupHangouts = ({ hangouts }) => {
  const [displayType, setDisplayType] = useState('pendingHangouts')

  const { pastHangouts, pendingHangouts, upcomingHangouts } = splitHangouts(hangouts)

  const isSmall = useMediaQuery('(max-width:600px)')

  const renderListType = () => {
    if (displayType === 'pendingHangouts') {
      return <HangoutsList hangouts={pendingHangouts} />
    } else if (displayType === 'upcomingHangouts') {
      return <HangoutsList hangouts={upcomingHangouts} />
    } else if (displayType === 'pastHangouts') {
      return <HangoutsList hangouts={pastHangouts} past />
    } else if (displayType === 'newHangout') {
      return <HangoutForm setDisplayType={setDisplayType} />
    }
  }

  const handleChange = (event, newDisplayType) => {
    if (newDisplayType !== null) {
      setDisplayType(newDisplayType)
    }
  }

  return (
    <Box mt={4}>
      <ToggleButtonGroup
        color="primary"
        value={displayType}
        exclusive
        onChange={handleChange}
        sx={{ marginBottom: 2 }}
        orientation={isSmall ? 'vertical' : 'horizontal'}
        fullWidth={isSmall ? true : false }
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
}

export default GroupHangouts