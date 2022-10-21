import { useState, useEffect } from "react";
import { getMyGroups } from "../utils/apiHelper";

import Typography from "@mui/material/Typography";
import NewGroupButton from "./NewGroupButton";

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
    <div>Loading</div>
  ) : (
    <>
      <Typography variant="h3" component="h2" mt={3}>
        Hello there, {user?.name}!
      </Typography>
      {myGroups.map((group) => (
        <li key={group._id}>
          {group.title} --- {group.description}
        </li>
      ))}
      <NewGroupButton />{" "}
    </>
  );
};

export default Home;
