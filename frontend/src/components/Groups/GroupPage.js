import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getGroup } from "../../utils/apiHelper";
import Loading from "../Loading";
import GroupHangoutsList from "./GroupHangoutsList";

import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import { Box } from "@mui/material";

const linkStyle = {
  fontWeight: 500,
  color: "blue",
  textDecoration: "underline",
};

const GroupPage = () => {
  const { groupPath } = useParams();
  const navigate = useNavigate();

  const { isLoading, error, data } = useQuery(["group", groupPath], () =>
    getGroup(groupPath)
  );

  if (isLoading) {
    return <Loading />;
  }

  console.log(data)

  if (error) {
    console.log(error);
    navigate("/error");
  }

  const hangouts = data.hangouts;

  return (
    <Box>
      <Typography variant="h3" component="h2" mt={6} mb={6}>
        {data?.title}
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
        {data?.description}
      </Typography>

      <Typography gutterBottom variant="h5" mt={6}>
        Members
      </Typography>
      <Stack direction="row" spacing={2}>
        <Avatar sx={{ width: 75, height: 75 }}>{data.admin.name[0]}</Avatar>
        <Avatar>T</Avatar>
        <Avatar>E</Avatar>
        <Avatar>M</Avatar>
        <Avatar>P</Avatar>
      </Stack>

      <Typography gutterBottom variant="h5" mt={6}>
        Upcoming Hangouts
      </Typography>

      <GroupHangoutsList hangouts={hangouts} />

      <Link style={linkStyle} to="./hangouts/create">
        Host a hangout
      </Link>
    </Box>
  );
};

export default GroupPage;
