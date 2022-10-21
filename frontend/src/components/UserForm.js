import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import LinearProgress from "@mui/material/LinearProgress";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { useLocation, useNavigate } from "react-router-dom";
import { registerUser, loginUser } from "../utils/apiHelper";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © Leo Cheng "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

const emptyForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function UserForm({ setUser }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(emptyForm);

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [checked, setChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // returns true if no errors are found
  const validateFields = () => {
    let noErrors = true;
    // set error if email is invalid format
    if (!formData.email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
      setEmailError("Email address is invalid.");
      noErrors = false;
    }

    // validations specific for registering
    if (pathname === "/register") {
      // set error if passowrds do not match
      if (formData.password !== formData.confirmPassword) {
        setConfirmPasswordError("Passwords do not match.");
        noErrors = false;
      }

      // set error if password is too short
      if (formData.password.length < 6) {
        setPasswordError("Password must be at least 6 characters.");
        noErrors = false;
      }

      // set error if any field is empty
      if (formData.name === "") {
        setNameError("Name is required.");
        noErrors = false;
      }
    }

    if (formData.email === "") {
      setEmailError("Email address is required.");
      noErrors = false;
    }

    if (formData.password === "") {
      setPasswordError("Password is required.");
      noErrors = false;
    }

    return noErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    if (validateFields()) {
      let response;
      if (pathname === "/login") {
        response = await loginUser(formData);
      } else {
        response = await registerUser(formData);
      }

      if (
        response === "User already exists!" ||
        response === "Invalid credentials."
      ) {
        setEmailError(response);        
      }

      if (response.token) {
        window.localStorage.setItem("currentUser", JSON.stringify(response));
        setUser(response);
        navigate("/");
      }
    }

    setSubmitting(false)
  };

  // reset everything on switching form type
  useEffect(() => {
    setFormData(emptyForm);
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
  }, [pathname]);

  const renderSwitchType = () => {  
    return pathname === "/login" ? (
      <Link variant="body2" onClick={() => navigate("/register")}>
        "Don't have an account? Sign Up"
      </Link>
    ) : (
      <Link variant="body2" onClick={() => navigate("/login")}>
        "Already have an account? Sign In"
      </Link>
    );
  };

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));

    if (e.target.name === "name") setNameError("");
    if (e.target.name === "email") setEmailError("");
    if (e.target.name === "confirmPassword") setConfirmPasswordError("");
    if (e.target.name === "password") setPasswordError("");
  };

  const handleCheckbox = (e) => {
    setChecked(e.target.checked);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {pathname === "/login" ? "Sign in" : "Sign up"}
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            {pathname === "/register" && (
              <TextField
                error={nameError !== ""}
                helperText={nameError}
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                value={formData.name}
                autoComplete="name"
                onChange={handleChange}
              />
            )}
            <TextField
              error={emailError !== ""}
              helperText={emailError}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              value={formData.email}
              autoComplete="email"
              onChange={handleChange}
            />
            <TextField
              error={passwordError !== ""}
              helperText={passwordError}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={formData.password}
              autoComplete="current-password"
              onChange={handleChange}
            />
            {pathname === "/register" && (
              <TextField
                error={confirmPasswordError !== ""}
                helperText={confirmPasswordError}
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            )}
            <FormControlLabel
              control={
                <Checkbox
                  value="remember"
                  color="primary"
                  checked={checked}
                  onChange={handleCheckbox}
                />
              }
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={submitting}
            >
              {pathname === "/login" ? "Sign In" : "Sign Up"}
            </Button>
            <Grid container>
              <Grid item xs>
                <Link variant="body2">Forgot password?</Link>
              </Grid>
              <Grid item>{renderSwitchType()}</Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
