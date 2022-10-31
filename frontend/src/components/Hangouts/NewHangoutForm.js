import { useState } from "react";
import { Calendar } from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";

import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

const emptyForm = {
  title: "",
  description: "",
  location: "",
  dateOptions: [],
};

const errorStyle = {
  fontFamily: "Roboto",
  color: "#d32f2f",
  fontSize: ".75rem",
  marginLeft: "14px",
  marginTop: "3px",
};

const datePickerStyles = {
  padding: "14px",  
  height: '2.5rem',
  width: '100%',
};

const NewHangoutForm = () => {
  const [formData, setFormData] = useState(emptyForm);

  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [datesError, setDatesError] = useState("");

  const validateFields = () => {
    let noErrors = true;

    if (formData.title === "") {
      setTitleError("Title is required.");
      noErrors = false;
    }

    if (formData.description === "") {
      setDescriptionError("Description is required.");
      noErrors = false;
    }

    if (formData.dateOptions.length === 0) {
      setDatesError("At least 1 date must be specified.");
      noErrors = false;
    }

    if (formData.dateOptions.length > 7) {
      setDatesError("Maximum of 7 dates can be specified.");
      noErrors = false;
    }

    return noErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    validateFields();
    console.log(formData);
  };

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));

    if (e.target.name === "title") setTitleError("");
    if (e.target.name === "description") setDescriptionError("");
  };

  const handleDateChange = (date) => {
    setFormData((prevState) => ({
      ...prevState,
      dateOptions: date.map((d) => d.toDate()), // convert dates from library to JS date objects
    }));
    setDatesError("");
  };

  return (
    <>
      <Typography variant="h3" component="h2" mt={3}>
        Create a new hangout!
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ mt: 3, width: 2 / 3 }}
      >
        <Stack spacing={3}>
          <TextField
            error={titleError !== ""}
            helperText={titleError}
            required
            id="title"
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />

          <TextField
            error={descriptionError !== ""}
            helperText={descriptionError}
            required
            id="description"
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
            placeholder="Write a short description for your new hangout!"
          />

          <TextField
            id="location"
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />

          <Typography variant="subtitle2" color="text.secondary">
            Suggest Dates (7 max):
          </Typography>
        </Stack>
        <Calendar
          style={datePickerStyles}
          multiple
          sort
          value={formData.dateOptions}          
          onChange={handleDateChange}
          minDate={Date.now()}
          name="dateOptions"
          id="dateOptions"
          plugins={[<DatePanel />]}
        />
        {datesError !== "" && <span style={errorStyle}>{datesError}</span>}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Create
        </Button>
      </Box>
    </>
  );
};

export default NewHangoutForm;
