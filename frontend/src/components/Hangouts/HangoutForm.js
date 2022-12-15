import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getHangoutByPath } from '../../utils/apiHelper'
import { createHangout, updateHangout } from '../../utils/apiHelper'
import { parseDate } from '../../utils/date'
import { Calendar } from 'react-multi-date-picker'
import DatePanel from 'react-multi-date-picker/plugins/date_panel'

import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import { useCurrentUser } from '../../utils/hooks'

const errorStyle = {
  fontFamily: 'Roboto',
  color: '#d32f2f',
  fontSize: '.75rem',
  marginLeft: '14px',
  marginTop: '3px',
}

const datePickerStyles = {
  padding: '14px',
  height: '2.5rem',
  width: '100%',
}

const HangoutForm = ({ edit = false }) => {
  // const [hangout, setHangout] = useState(null)
  const { hangoutPath, groupPath } = useParams()
  const navigate = useNavigate()
  const { user } = useCurrentUser()

  const {
    error,
    data: hangout,
  } = useQuery({
    queryKey: ['hangout', hangoutPath],
    queryFn: () => getHangoutByPath(hangoutPath),
    enabled: !!hangoutPath
  })

  if (error) {
    navigate('/error')
    console.log(error)
  }

  const defaultForm = {
    title: hangout ? hangout.title : '',
    description: hangout ? hangout.description : '',
    location: hangout ? hangout.location : '',
  }


  const [formData, setFormData] = useState(defaultForm)
  const [dateOptions, setDateOptions] = useState(hangout ? Object.keys(hangout.dateOptions) : [])

  const [titleError, setTitleError] = useState('')
  const [descriptionError, setDescriptionError] = useState('')
  const [datesError, setDatesError] = useState('')

  const validateFields = () => {
    let noErrors = true

    if (formData.title === '') {
      setTitleError('Title is required.')
      noErrors = false
    }

    if (formData.description === '') {
      setDescriptionError('Description is required.')
      noErrors = false
    }

    if (dateOptions.length === 0) {
      setDatesError('At least 1 date must be specified.')
      noErrors = false
    }

    if (dateOptions.length > 7) {
      setDatesError('Maximum of 7 dates can be specified.')
      noErrors = false
    }

    return noErrors
  }

  const parseDateOptions = () => {
    const parsedDateOptions = {}

    for (let date of dateOptions) {
      let parsedDate = parseDate(date.toDate())
      parsedDateOptions[parsedDate] = []
    }

    return parsedDateOptions
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    let response
    if (validateFields()) {
      if (!edit) {
        response = await createHangout({
          ...formData,
          // description: formData.description.split('\n').join('\n'),
          groupPath,
          dateOptions: parseDateOptions()
        })
      } else {
        response = await updateHangout( hangout._id, {
          ...formData,
          groupPath,
        })
      }
      navigate(`/groups/${groupPath}/hangouts/${response.path}`)
    }
  }

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))

    if (e.target.name === 'title') setTitleError('')
    if (e.target.name === 'description') setDescriptionError('')
  }

  const handleDateChange = (dates) => {
    setDateOptions(dates)
    setDatesError('')
  }

  useEffect(() => {
    if (hangout && hangout.planner._id !== user._id) {
      navigate('/error')
    }
  }, [hangout, navigate, user._id])

  return (
    <>
      <Typography variant="h5" component="h2" mt={3}>
        { hangout ? 'Edit your hangout!' : 'Fill out your hangout details!' }
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ mt: 3, width: edit ? 2/3 : null }}
      >
        <Stack spacing={3}>
          <TextField
            error={titleError !== ''}
            helperText={titleError}
            required
            id="title"
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />

          <TextField
            error={descriptionError !== ''}
            helperText={descriptionError}
            required
            id="description"
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            // rows={4}
            placeholder="Write a short description for your new hangout!"
          />

          <TextField
            id="location"
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />

          {
            !edit &&
          <>
            <Typography variant="subtitle2" color="text.secondary">
            Suggest Dates (7 max):
            </Typography>

            <Calendar
              style={datePickerStyles}
              multiple
              sort
              value={dateOptions}
              onChange={handleDateChange}
              minDate={Date.now()}
              name="dateOptions"
              id="dateOptions"
              plugins={[<DatePanel />]}
            />
            {datesError !== '' && <span style={errorStyle}>{datesError}</span>}
          </>
          }
        </Stack>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          { edit ? 'Update' : 'Create' }
        </Button>
        {
          edit &&
          <Button
            fullWidth
            variant="outlined"
            onClick={() => navigate(-1)}
          >
          Go Back
          </Button>
        }
      </Box>
    </>
  )
}

export default HangoutForm
