import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getGroup } from "../../utils/apiHelper";
import Loading from "../Loading";

import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

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
    </Box>
  );
};

export default GroupPage;
