import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getGroup } from "../../utils/apiHelper";
import Loading from "../Loading";

import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

const GroupPage = () => {
  const { path } = useParams();

  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (path === "undefined") {
      navigate("/error");
    } else {
      setLoading(true);
      getGroup(path)
        .then((group) => {
          setGroup(group);
        })
        .then(() => setLoading(false))
        .catch((err) => console.log("GroupPage: ", err));
    }
  }, [path, navigate]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Box>
          <Typography gutterBottom variant="h2">
            {group.title}
          </Typography>
          <Typography gutterBottom variant="subtitle1">
            {group.description}
          </Typography>   
        </Box>
      )}
    </>
  );
};

export default GroupPage;
