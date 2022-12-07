import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getHangoutByPath } from "../../utils/apiHelper";
import { useCurrentUser } from "../../utils/userHooks";
import Loading from "../Loading";

import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import BackArrow from "../BackArrow";



const HangoutPage = () => {
  const { user } = useCurrentUser()
  const { hangoutPath } = useParams();
  const navigate = useNavigate();

  const { isLoading, error, data: hangout } = useQuery(["hangout", hangoutPath], () => 
    getHangoutByPath(hangoutPath)
  )

  if (isLoading) {
    return <Loading />;
  }

  console.log(hangout)

  if (error) {
    console.log(error);
    navigate("/error");
  }

  const attendees = hangout.attendees

  const generateAvatars = () => {
    return attendees.map(att => <Avatar key={att._id}>{att.name[0]}</Avatar>)
  }

  return (
    <Box mt={3}>
      <BackArrow link={`/groups/${hangout.groupPath}`}/>
      <Typography variant="h3" component="h2" mt={3} mb={6}>
        {hangout?.title}
      </Typography>

      <Box
        component="img"
        sx={{
          height: 233,
          width: 350,
          maxHeight: { xs: 233, md: 167 },
          maxWidth: { xs: 350, md: 250 },
        }}
        alt="placeholder"
        src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&w=350&dpr=2"
      />

      <Typography gutterBottom variant="subtitle1" mt={3}>
        {hangout?.description}
      </Typography>

      <Typography gutterBottom variant="h5" mt={6} mb={3}>
        Attending ({attendees.length})
      </Typography>


      <Stack direction="row" spacing={2}>
        <Avatar sx={{ width: 75, height: 75 }}>{hangout.planner.name[0]}</Avatar>
        { generateAvatars() }
      </Stack>
    </Box>
  )
}

export default HangoutPage