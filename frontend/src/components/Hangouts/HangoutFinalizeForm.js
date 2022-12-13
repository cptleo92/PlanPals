import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import { FormHelperText } from '@mui/material'
import { finalizeHangout } from '../../utils/apiHelper'

const HangoutFinalizeForm = ({
  dateOptions,
  id,
  handleClose,
  setModalTitle,
  setModalContents,
}) => {
  const [error, setError] = useState(false)
  const [helperText, setHelperText] = useState(null)
  const [finalDate, setFinalDate] = useState(null)
  const navigate = useNavigate()

  const sortedDates = Object.keys(dateOptions).sort((a, b) => {
    return new Date(a) - new Date(b)
  })

  const getVoteNumber = (date) => {
    return dateOptions[date].length
  }


  const handleFinalize = async () => {

    try {
      await finalizeHangout(id, { finalDate })
      navigate(0)
    } catch (error) {
      navigate('/error')
      console.log(error)
    }
  }

  const handleFinalizeConfirmation = () => {
    if (!finalDate) {
      setError(true)
      setHelperText('Must have at least 1 date selected!')
      return
    }

    const confirmation = (
      <>
        <Typography variant="subtitle1">
          { finalDate }
        </Typography>
        <Box
          mt={3}
          sx={{
            display: 'flex',
            justifyContent: 'right',
          }}
        >
          <Button variant="outlined" onClick={handleClose}>
          Cancel
          </Button>
          <Button
            sx={{ marginLeft: 2 }}
            variant="contained"
            onClick={handleFinalize}
          >
          Yes
          </Button>
        </Box>
      </>
    )

    setModalTitle('Are you sure you want to select this date?')
    setModalContents(confirmation)
  }

  const handleChange = (e) => {
    setHelperText(null)
    setError(false)
    setFinalDate(e.target.value)
  }

  const renderRadioLine = (date) => {
    return (
      <Box>
        <Typography variant="body1">{date}</Typography>
        <Typography variant="subtitle2" color="text.secondary">{`Number of votes: ${getVoteNumber(date)}`}</Typography>
      </Box>
    )
  }

  return (
    <>
      <FormControl error={error}>
        <RadioGroup
          aria-labelledby="date-selection-radio-group"
          name="radio-buttons-group"
        >
          {sortedDates.map((date) => (
            <FormControlLabel
              key={date}
              value={date}
              control={<Radio />}
              label={renderRadioLine(date)}
              onChange={handleChange}
              sx={{
                marginY: 1
              }}
            />
          ))}
        </RadioGroup>
        <FormHelperText>{helperText}</FormHelperText>
      </FormControl>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Button onClick={handleFinalizeConfirmation}>
          Finalize
        </Button>
      </Box>


    </>
  )
}

export default HangoutFinalizeForm
