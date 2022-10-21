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
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { useLocation, useNavigate } from "react-router-dom";
import { registerUser, loginUser } from '../utils/apiHelper'

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

const noEmptyFields = {
  name: false,
  email: false,
  password: false,
};

const emptyForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function UserForm({ setUser }) {
  const { pathname } = useLocation();
  const navigate = useNavigate()

  const [formData, setFormData] = useState(emptyForm);

  const [emptyFields, setEmptyFields] = useState(noEmptyFields);
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [emailTaken, setEmailTaken] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [passwordLengthError, setPasswordLengthError] = useState(false);
  const [loginError, setLoginError] = useState(false)  

  const [checked, setChecked] = useState(false);

  // returns true if no errors are found
  const validateFields = () => {
    let noErrors = true;
    // set error if email is invalid format
    if (
      !formData.email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)
    ) {
      setEmailInvalid(true);
      noErrors = false;
    }

    // validations specific for registering
    if (pathname === "/register") {
      // set error if passowrds do not match
      if (formData.password !== formData.confirmPassword) {
        setPasswordMatchError(true);
        noErrors = false;
      }

      // set error if password is too short
      if (formData.password.length < 6) {
        setPasswordLengthError(true);
        noErrors = false;
      }

      // set error if any field is empty
      if (formData.name === "") {
        setEmptyFields((prevState) => ({
          ...prevState,
          name: true,
        }));
        noErrors = false;
      }

      if (formData.confirmPassword === "") {
        setEmptyFields((prevState) => ({
          ...prevState,
          confirmPassword: true,
        }));
        noErrors = false;
      }
    }

    if (formData.email === "") {
      setEmptyFields((prevState) => ({
        ...prevState,
        email: true,
      }));
      noErrors = false;
    }

    if (formData.password === "") {
      setEmptyFields((prevState) => ({
        ...prevState,
        password: true,
      }));
      noErrors = false;
    }

    return noErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateFields()) return
  
    let response;
    if (pathname === "/login") {
      response = await loginUser(formData)      
    } else {
      response = await registerUser(formData)      
    }

    if (response === "User already exists!") {
      setEmailTaken(true)
      return
    }

    if (response === "Invalid credentials") {
      setLoginError(true)
      return
    }

    window.localStorage.setItem('currentUser', JSON.stringify(response))
    setUser(response)
    navigate('/')
  };

  // reset everything on switching form type
  useEffect(() => {
    setFormData(emptyForm);
    setEmptyFields(noEmptyFields);
    setEmailInvalid(false);
    setPasswordMatchError(false);
    setPasswordLengthError(false);
  }, [pathname]);

  const renderSwitchType = () => {
    return pathname === "/login" ? (
      <Link variant="body2" onClick={() => navigate('/register')}>"Don't have an account? Sign Up"</Link>
    ) : (
      <Link variant="body2" onClick={()=> navigate('/login')}>"Already have an account? Sign In"</Link>
    );
  };

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    setEmptyFields((prevState) => ({
      ...prevState,
      [e.target.name]: false,
    }));

    if (e.target.name === "email") {
      setEmailInvalid(false);
      setLoginError(false)
      setEmailTaken(false)
    }
    if (e.target.name === "confirmPassword") setPasswordMatchError(false);
    if (e.target.name === "password") setPasswordLengthError(false);
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
                error={emptyFields.name}
                helperText={emptyFields.name && "Name is required."}
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
              error={emptyFields.email || emailInvalid || loginError || emailTaken}
              helperText={
                (emptyFields.email && "Email address is required.") ||
                (emailInvalid && "Email address is invalid.") || 
                (loginError && "Invalid credentials.") || 
                (emailTaken && "Email is already in use.")
              }
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
              error={emptyFields.password || passwordLengthError}
              helperText={
                (emptyFields.password && "Password is required.") ||
                (passwordLengthError &&
                  "Password must be at least 6 characters.")
              }
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
                error={passwordMatchError}
                helperText={passwordMatchError && "Passwords do not match."}
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
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link variant="body2">Forgot password?</Link>
              </Grid>
              <Grid item>
                {renderSwitchType()}
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
