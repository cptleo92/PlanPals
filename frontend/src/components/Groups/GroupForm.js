import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { createGroup } from '../../utils/apiHelper'
import { getGroup, updateGroup } from '../../utils/apiHelper'
import { useCurrentUser } from '../../utils/hooks'

import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import Fab from '@mui/material/Fab'

const GroupForm = ({ edit }) => {
  const navigate = useNavigate()
  const { groupPath } = useParams()
  const { user } = useCurrentUser()
  const inputFile = useRef(null)

  const [file, setFile] = useState()

  const { error, data: group } = useQuery({
    queryKey: ['group', groupPath],
    queryFn: () => getGroup(groupPath),
    enabled: !!groupPath
  })

  if (error) {
    navigate('/error')
    console.log(error)
  }

  const [formData, setFormData] = useState({
    title: group ? group.title : '',
    description: group ? group.description : '',
  })

  const [titleError, setTitleError] = useState('')
  const [descriptionError, setDescriptionError] = useState('')

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

    return noErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateFields()) {
      try {
        if (edit) {
          await updateGroup(group._id, formData)
        } else {
          await createGroup(formData)
        }
        navigate('/home')
      } catch (error) {
        navigate('/error')
        console.log(error)
      }

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

  const handleOpenFile = () => {
    inputFile.current.click()
  }

  const handleFileInput = (e) => {
    let file = e.target.files[0]
    if (file) setFile(file)
  }

  const renderUploadOrImage = () => {
    return !file
      ?
      (
        <Box
          onClick={handleOpenFile}
          sx={{
            marginY: 3,
            padding: 5,
            width: 500,
            height: 240,
            border: '1px solid lightgray',
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'text.disabled',
            cursor: 'pointer'
          }}>
          <AddAPhotoIcon size='large' />
          <Typography variant="h6" sx={{ marginTop: 3 }}>
              Set a photo for your group!
          </Typography>
        </Box>
      )
      :
      (
        <Box sx={{
          width: 500,
          height: 240,
          position: 'relative'
        }}>
          <img
            src={URL.createObjectURL(file)}
            alt="preview"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
          <Stack direction="row" spacing={2} sx={{
            position: 'absolute',
            right: 5,
            bottom: 5
          }}>
            <Fab color="secondary" aria-label="edit" onClick={handleOpenFile}>
              <EditIcon />
            </Fab>
            <Fab color="error" aria-label="edit" onClick={() => setFile(null)}>
              <DeleteIcon />
            </Fab>
          </Stack>
        </Box>



      )

  }

  useEffect(() => {
    if (group && group.admin._id !== user._id) {
      navigate('/error')
    }
  }, [group, navigate, user._id])

  return (
    <>
      <Typography variant="h3" component="h2" mt={3}>
        {edit ? 'Edit Your Group!' : 'Create a new group!'}
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ mt: 3, width: 2 / 3 }}
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
            rows={4}
            placeholder="Write a short description for your new group!"
          />
          <input
            onChange={handleFileInput}
            type='file'
            id='file'
            ref={inputFile}
            style={{ display: 'none' }}
            accept="image/*" />
          {renderUploadOrImage()}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {edit ? 'Update' : 'Create'}
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </Stack>
      </Box>
    </>
  )
}

export default GroupForm
