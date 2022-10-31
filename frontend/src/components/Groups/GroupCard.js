import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { useNavigate } from 'react-router-dom'

const GroupCard = ({ group }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/groups/${group.path}`)
  }

  return (
    <Card sx={{ width: 270 }}>
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
        <Typography variant="body2" color="text.secondary">
          {group.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={handleClick}>View Group</Button>
      </CardActions>
    </Card>
  )
}

export default GroupCard