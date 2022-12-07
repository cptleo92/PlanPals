import { useCurrentUser } from "../../utils/userHooks";
import { useNavigate } from "react-router-dom";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import StarIcon from "@mui/icons-material/Star";
import Tooltip from "@mui/material/Tooltip";

const GroupCard = ({ group }) => {
  const { user } = useCurrentUser();

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/groups/${group.path}`);
  };

  const showIfAdmin = () => {
    if (user._id === group.admin) {
      return (
        <Tooltip title="You are the admin!">
          <StarIcon sx={{ color: "orange" }} />
        </Tooltip>
      );
    }
  };

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
        { showIfAdmin() }
        <Button size="small" onClick={handleClick}>
          View Group
        </Button>        
      </CardActions>
    </Card>
  );
};

export default GroupCard;
