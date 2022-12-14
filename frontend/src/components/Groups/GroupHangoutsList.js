import { Link } from 'react-router-dom'

import GroupHangoutsListItem from './GroupHangoutsListItem'

import Typography from '@mui/material/Typography'



const GroupHangoutsList = ({ hangouts, past }) => {
  return (
    <>

      {
        hangouts.map(hangout => <GroupHangoutsListItem past={past} hangout={hangout} key={hangout._id} />)
      }

    </>
  )
}

export default GroupHangoutsList