import { useState, useEffect, useContext } from "react";
import { getMyGroups } from "../utils/apiHelper";

import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";

import NewGroupButton from "./Groups/NewGroupButton";
import Loading from "./Loading";
import GroupCard from "./Groups/GroupCard";

import { UserContext } from "../App";

const Home = () => {
  const [myGroups, setMyGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useContext(UserContext)

  useEffect(() => {
    setLoading(true);
    getMyGroups()
      .then((groups) => setMyGroups(groups))
      .then(() => setLoading(false))
      .catch((err) => console.log('home getMyGroups error', err));
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <>
      <Typography variant="h3" component="h2" mt={3}>
        Hello there, {user?.name}!
      </Typography>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} mb={2} mt={2}>        
        {myGroups.map((group) => (
          <Grid xs={2} sm={4} md={4} key={group._id}>
            <GroupCard group={group} />
          </Grid>
        ))}
      </Grid>

      <NewGroupButton />
    </>
  );
};

export default Home;
