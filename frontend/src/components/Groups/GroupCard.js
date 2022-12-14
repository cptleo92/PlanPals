import { useCurrentUser } from '../../utils/hooks'
import { useNavigate } from 'react-router-dom'

import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import StarIcon from '@mui/icons-material/Star'
import Tooltip from '@mui/material/Tooltip'
import PeopleIcon from '@mui/icons-material/People'

const GroupCard = ({ group }) => {
  const { user } = useCurrentUser()

  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/groups/${group.path}`)
  }

  const showIfAdmin = () => {
    if (user._id === group.admin) {
      return (
        <Tooltip title="You are the admin!">
          <StarIcon
            sx={{
              color: 'orange',
              position: 'absolute',
              bottom: 10,
              right: 10,
              fontSize: '32px',
            }}
          />
        </Tooltip>
      )
    }
  }

  return (
    <Card sx={{ width: 270, position: 'relative' }}>
      {showIfAdmin()}
      <CardMedia
        component="img"
        height="120"
        image="https://placebear.com/270/120"
        alt="placeholder"
      />
      <CardContent>
        <Typography gutterBottom variant="h5">
          {group.title}
        </Typography>
        <Typography gutterBottom variant="body2" color="text.secondary">
          {group.description}
        </Typography>
        <Typography variant="button" color='text.primary'>
          <PeopleIcon fontSize="inherit" /> {group.members.length}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={handleClick}>
          View Group
        </Button>
      </CardActions>
    </Card>
  )
}

export default GroupCard
