import { useState } from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'

const errorStyle = {
  fontFamily: 'Roboto',
  color: '#d32f2f',
  fontSize: '.75rem',
  marginLeft: '14px',
  marginTop: '3px',
}

export default function HangoutAttendDatesForm({ id, dateOptions }) {
  const [checked, setChecked] = useState([])
  const [error, setError] = useState(false)

  console.log(id)

  const handleToggle = (value) => () => {
    setError(false)
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    setChecked(newChecked)
  }

  const handleSubmit = () => {
    if (checked.length === 0) {
      setError(true)
    } else {
      console.log(checked)
    }
  }

  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {dateOptions.map((date, idx) => {
        const labelId = `checkbox-list-label-${idx}`

        return (
          <ListItem key={idx} disablePadding>
            <ListItemButton role={undefined} onClick={handleToggle(date)} dense>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={checked.indexOf(date) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText
                id={labelId}
                primary={`${date}`}
                secondary={'Number of votes'}
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
