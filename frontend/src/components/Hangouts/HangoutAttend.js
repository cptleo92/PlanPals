import { useState } from 'react'

import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import HangoutAttendDatesForm from './HangoutAttendDatesForm'
import { useCurrentUser } from '../../utils/userHooks'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

const HangoutAttend = ({ hangout, isPlanner, isAttending }) => {
  // modal state handling
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const { user } = useCurrentUser()

  return (
    <div>
      <Button
        size="small"
        variant="contained"
        color="secondary"
        onClick={handleOpen}
      >
        { isAttending ? 'Edit RSVP' : 'RSVP' }
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Select at least 1 date that you are available!
          </Typography>

          <HangoutAttendDatesForm
            dateOptions={hangout.dateOptions}
            id={hangout._id}
          />
        </Box>
      </Modal>
    </div>
  )
}

export default HangoutAttend
