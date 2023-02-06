import { useState } from 'react'
import { useCurrentUser } from '../../utils/hooks'
import {
  updateHangoutDateVotes,
  joinHangout,
  leaveHangout,
} from '../../utils/apiHelper'
import { useNavigate } from 'react-router-dom'
import { parseDate } from '../../utils/date'

import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

const errorStyle = {
  fontFamily: 'Roboto',
  color: '#d32f2f',
  fontSize: '.75rem',
  marginLeft: '14px',
  marginTop: '3px',
}

export default function HangoutAttendDatesForm({
  id,
  dateOptions,

}) {
  const { user } = useCurrentUser()
  let isAttending = false

  const getUserDates = () => {
    // get votes array from dateOptions
    // return array of dates that includes user id

    const selectedDates = []

    for (let [date, votes] of Object.entries(dateOptions)) {
      if (votes.includes(user._id)) selectedDates.push(date)
    }

    // if array is empty at the end, that means user is not attending yet
    isAttending = selectedDates.length !== 0

    return selectedDates
  }

  const [dateVotes, setDateVotes] = useState(getUserDates())
  const [error, setError] = useState(false)
  const navigate = useNavigate()

  const sortedDates = Object.keys(dateOptions).sort((a, b) => {
    return new Date(a) - new Date(b)
  })

  const getVoteNumber = (date) => {
    return dateOptions[date].length
  }

  const handleToggle = (value) => () => {
    setError(false)
    const currentIndex = dateVotes.indexOf(value)
    const newDateVotes = [...dateVotes]

    if (currentIndex === -1) {
      newDateVotes.push(value)
    } else {
      newDateVotes.splice(currentIndex, 1)
    }

    setDateVotes(newDateVotes)
  }

  const handleSubmit = async () => {
    if (dateVotes.length === 0) {
      setError(true)
    } else {
      try {
        if (isAttending) {
          await updateHangoutDateVotes(id, dateVotes)
        } else {
          await joinHangout(id, dateVotes)
        }

        navigate(0)
      } catch (error) {
        navigate('/error')
        console.log(error)
      }
    }
  }

  const handleLeave = async () => {
    try {
      await leaveHangout(id)
      navigate(0)
    } catch (error) {
      navigate('/error')
    }
  }

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {sortedDates.map((date, idx) => {
        const labelId = `checkbox-list-label-${idx}`

        return (
          <ListItem key={idx} disablePadding>
            <ListItemButton role={undefined} onClick={handleToggle(date)} dense>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={dateVotes.indexOf(date) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText
                id={labelId}
                primary={parseDate(date)}
                secondary={`Number of votes: ${getVoteNumber(date)}`}
              />
            </ListItemButton>
          </ListItem>
        )
      })}

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Button onClick={handleSubmit}>
          {isAttending ? 'Edit' : 'Attend'}
        </Button>
        {isAttending && (
          <Button onClick={handleOpen} color="error">
            Leave
          </Button>
        )}
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Edit RSVP</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to no longer attend the hangout?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleLeave} variant="contained" color="error">
              Leave
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {error && (
        <span style={errorStyle}>Must have at least 1 date selected!</span>
      )}
    </List>
  )
}
