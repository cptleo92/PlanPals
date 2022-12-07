import Card from '@mui/material/Card'
// import CardActions from "@mui/material/CardActions";
// import CardMedia from "@mui/material/CardMedia";
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

import AddIcon from '@mui/icons-material/Add'
import { IconButton } from '@mui/material'

import { useNavigate } from 'react-router-dom'

const NewGroupButton = () => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate('/groups/create')
  }

  return (
    <Card sx={{ maxWidth: 250 }}>
      <CardContent  sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h6">Create a new group!</Typography>
        <IconButton sx={{ width: 150, height: 150 }} onClick={handleClick}>
          <AddIcon sx={{ width: 100, height: 100 }}/>
        </IconButton>
      </CardContent>
    </Card>
  )
}

export default NewGroupButton
