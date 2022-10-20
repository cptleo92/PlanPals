import { useState } from "react";

import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

const NewGroupForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <>
      <Typography variant="h3" component="h2" mt={3}>
        Create a new group!
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3, width: 2/3 }}>
        <Stack spacing={3}>
          
            <TextField
              required
              id="title"
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}              
            />         
          
            <TextField
              required
              id="outlined-multiline-static"
              label="Description"
              multiline
              rows={4}
              placeholder="Write a short description for your new group!"
            />
          <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}             
            >
              Create
            </Button>
        </Stack>
      </Box>
    </>
  );
};

export default NewGroupForm;
