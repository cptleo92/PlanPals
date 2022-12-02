import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getGroup } from "../../utils/apiHelper";
import Loading from "../Loading";

import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

const linkStyle = {
  fontWeight: 500,
  color: 'blue',
  textDecoration: 'underline'
}

const GroupPage = () => {
  const { path } = useParams();
  const navigate = useNavigate();

  const { isLoading, error, data } = useQuery(["group", path], () => getGroup(path))

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    console.log(error)
    navigate('/error') 
  }

  return (
    <Box>
      <Typography gutterBottom variant="h2">
        {data?.title}
      </Typography>
      <Typography gutterBottom variant="subtitle1">
        {data?.description}
      </Typography>
      <Link style={linkStyle} to="./hangouts/create">Host a hangout</Link>
    </Box>
  );
};

export default GroupPage;
