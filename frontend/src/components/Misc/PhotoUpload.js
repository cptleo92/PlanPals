import { useRef, useState } from 'react'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import Fab from '@mui/material/Fab'

const PhotoUpload = ({ type, file, setFile }) => {
  const inputFile = useRef(null)
  const [sizeError, setSizeError] = useState(false)

  const handleOpenFile = () => {
    inputFile.current.click()
  }

  const handleFileInput = (e) => {
    let file = e.target.files[0]

    if (file) {
      if (file.size > 1000000) {
        setSizeError(true)
        return
      }

      setSizeError(false)
      setFile(file)
    }
  }

  const renderUploadOrPreview = () => {
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
          Set a photo for your {type}!
          </Typography>
          {
            sizeError &&
          <Typography variant="subtitle2" color="error" sx={{ marginTop: 1 }}>
          File must be less than 1MB.
          </Typography>
          }
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
            src={typeof file === 'string' ? file : URL.createObjectURL(file)}
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

  return (
    <>
      <input
        onChange={handleFileInput}
        type='file'
        id='file'
        ref={inputFile}
        style={{ display: 'none' }}
        accept="image/*" />
      { renderUploadOrPreview() }
    </>
  )
}

export default PhotoUpload