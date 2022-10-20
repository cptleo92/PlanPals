
import Typography from "@mui/material/Typography";
import NewGroupButton from "./NewGroupButton";

const Home = ({ user }) => {
  return (
    <>
      <Typography variant="h3" component="h2" mt={3}>
        Hello there, {user?.name}!
      </Typography>
      <NewGroupButton />{" "}
    </>
  );
};

export default Home;
