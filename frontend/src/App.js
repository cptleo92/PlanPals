import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

function App() {
  return (
    <Box
      sx={{
        width: 900,
        height: 900,
        margin: "auto"
      }}
    >
      Learn React
      <TextField id="outlined-basic" label="Outlined" variant="outlined" />
      <TextField id="filled-basic" label="Filled" variant="filled" />
      <TextField id="standard-basic" label="Standard" variant="standard" />
    </Box>
  );
}

export default App;
