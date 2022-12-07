import { useNavigate } from 'react-router-dom'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const BackArrow = ({ link }) => {
  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate(link)
  }

  return (
    <ArrowBackIcon onClick={handleGoBack} sx={{ cursor: 'pointer' }} />
  )
}

export default BackArrow