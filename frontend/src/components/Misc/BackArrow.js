import { useNavigate } from 'react-router-dom'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const BackArrow = () => {
  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <ArrowBackIcon onClick={handleGoBack} sx={{ cursor: 'pointer' }} />
  )
}

export default BackArrow