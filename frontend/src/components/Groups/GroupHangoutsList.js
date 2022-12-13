import { Link } from 'react-router-dom'

import GroupHangoutsListItem from './GroupHangoutsListItem'

import Typography from '@mui/material/Typography'



const GroupHangoutsList = ({ hangouts }) => {
  return (
    <>

      {
        hangouts.map(hangout => <GroupHangoutsListItem hangout={hangout} key={hangout._id} />)
      }

    </>
  )
}

export default GroupHangoutsList