import { useState, cloneElement } from 'react'

import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

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

const ButtonModal = ({ buttonText, title, color, children }) => {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setModalTitle(title)
    setModalContents(children)
    setOpen(false)
  }
  // const [buttonText, setButtonText] = useState(buttonText)
  const [modalTitle, setModalTitle] = useState(title)
  const [modalContents, setModalContents] = useState(children)

  return (
    <div>
      <Button
        size="small"
        variant="contained"
        color={color}
        onClick={handleOpen}
      >
        { buttonText }
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {modalTitle}
          </Typography>

          { cloneElement(modalContents, { handleClose, setModalTitle, setModalContents }) }
        </Box>
      </Modal>
    </div>

  )
}

export default ButtonModal