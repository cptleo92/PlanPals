import { useState } from 'react'
import { parseDate } from '../../utils/date'
import { useCurrentUser } from '../../utils/hooks'
import { leaveHangout, joinHangout } from '../../utils/apiHelper'
import { useNavigate } from 'react-router-dom'

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

const HangoutPageFinalDetails = ({ hangout }) => {
  const { user } = useCurrentUser()
  const navigate = useNavigate()

  const [submitting, setSubmitting] = useState(false)

  const handleLeave = async () => {
    setSubmitting(true)
    try {
      await leaveHangout(hangout._id)
      navigate(0)
    } catch (error) {
      navigate('/error')
      console.log(error)
    }
  }

  const handleAttend = async () => {
    setSubmitting(true)
    try {
      await joinHangout(hangout._id, [parseDate(hangout.finalDate)])
      navigate(0)
    } catch (error) {
      console.log(error)
      navigate('/error')
    }
  }

  const renderAction = () => {
    const memberIds = hangout.attendees.map((att) => att._id)
    const isMember = memberIds.includes(user._id)

    const text = isMember
      ? 'You are currently on the attending list! If you cannot make the date, please update your RSVP!'
      : 'You are not attending this hangout!'

    const buttonText = isMember ? 'Leave' : 'Attend'
    const buttonColor = isMember ? 'error': 'success'
    const buttonClick = isMember ? handleLeave : handleAttend

    return (
      <Box>
        <Typography gutterBottom variant="body1">
          {text}
        </Typography>
        <Button variant="contained" color={buttonColor} onClick={buttonClick} disabled={submitting}>
          {buttonText}
        </Button>
      </Box>
    )
  }

  return (
    <Stack spacing={1}>
      <Typography gutterBottom variant="h5">This hangout has been officially scheduled for:</Typography>
      <Typography variant="h6" color="darkGreen">{parseDate(hangout.finalDate)}</Typography>
      { hangout.planner._id !== user._id && renderAction()}
    </Stack>
  )
}

export default HangoutPageFinalDetails
