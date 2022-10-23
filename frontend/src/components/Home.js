import { useState, useEffect } from "react";
import { getMyGroups } from "../utils/apiHelper";

import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import Box from "@mui/material/Box";

import NewGroupButton from "./NewGroupButton";
import Loading from "./Loading";
import GroupCard from "./GroupCard";

const Home = ({ user }) => {
  const [myGroups, setMyGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getMyGroups()
      .then((groups) => setMyGroups(groups))
      .then(() => setLoading(false))
      .catch((err) => console.log(err));
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <>
      <Typography variant="h3" component="h2" mt={3}>
        Hello there, {user?.name}!
      </Typography>
      <Grid container spacing={2} mb={2} mt={2}>
        {myGroups.map((group) => (
          <Grid sx={4}>
            <GroupCard group={group} />
          </Grid>
        ))}
      </Grid>

      <NewGroupButton />
    </>
  );
};

export default Home;
