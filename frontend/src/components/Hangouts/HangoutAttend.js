import { useState } from 'react'

import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import HangoutAttendDatesForm from './HangoutAttendDatesForm'

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

const HangoutAttend = ({ hangout }) => {
  // modal state handling
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)



  // keep an eye out in case dates need to be sorted
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  const dateOptions = hangout.dateOptions.map(date => {
    return new Date(date).toLocaleDateString(undefined, options)
  })

  return (
    <div>
      <Button
        size="small"
        variant="contained"
        color="secondary"
        onClick={handleOpen}
      >
        RSVP
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

          <HangoutAttendDatesForm dateOptions={dateOptions} id={hangout._id} />

        </Box>
      </Modal>
    </div>
  )
}

export default HangoutAttend