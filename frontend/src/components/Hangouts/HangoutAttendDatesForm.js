import { useState } from 'react'
import { useCurrentUser } from '../../utils/userHooks'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import { updateHangoutDateVotes } from '../../utils/apiHelper'
import { useNavigate } from 'react-router-dom'

const errorStyle = {
  fontFamily: 'Roboto',
  color: '#d32f2f',
  fontSize: '.75rem',
  marginLeft: '14px',
  marginTop: '3px',
}

export default function HangoutAttendDatesForm({ id, dateOptions }) {
  const { user } = useCurrentUser()

  const getUserDates = () => {
    // get votes array from dateOptions
    // return array of dates that includes user id
    const selectedDates = []

    for (let [date, votes] of Object.entries(dateOptions)) {
      console.log(date, votes, user)
      if (votes.includes(user._id)) selectedDates.push(date)
    }

    return selectedDates
  }

  const [dateVotes, setDateVotes] = useState(getUserDates())
  const [error, setError] = useState(false)
  const navigate = useNavigate()

  const sortedDates = Object.keys(dateOptions).sort((a, b) => {
    return new Date(a) - new Date(b)
  })

  const parseDate = (date)  => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(date).toLocaleDateString(undefined, options)
  }

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
        await updateHangoutDateVotes(id, dateVotes)
        // console.log(response)
        navigate(0)
      } catch (error) {
        // console.log(error)
        navigate('/error')
      }

    }
  }

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

      <Button onClick={handleSubmit}>Submit</Button>
      {error && (
        <span style={errorStyle}>Must have at least 1 date selected!</span>
      )}
    </List>
  )
}
