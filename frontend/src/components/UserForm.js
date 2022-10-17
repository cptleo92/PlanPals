import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import MuiLink from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { useLocation, Link } from "react-router-dom";

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

const noErrors = {
  name: false,
  email: false,
  password: false,
};

export default function UserForm() {
  const { pathname } = useLocation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState(noErrors);
  const [emailInvalid, setEmailInvalid] = useState(false);

  const [checked, setChecked] = useState(false);

  const validateFields = () => {
    if (formData.name === "" && pathname === "/register") {
      setErrors((prevState) => ({
        ...prevState,
        name: true,
      }));
    }

    if (
      !formData.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
    ) {
      setEmailInvalid(true);
    }

    if (formData.email === "") {
      setErrors((prevState) => ({
        ...prevState,
        email: true,
      }));
    }

    if (formData.password === "") {
      setErrors((prevState) => ({
        ...prevState,
        password: true,
      }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    validateFields();

    console.log(
      {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      },
      checked
    );
  };

  // reset errors on switching form type
  useEffect(() => {
    setErrors(noErrors);
    setEmailInvalid(false);
  }, [pathname]);

  const renderSwitchType = () => {
    return pathname === "/login" ? (
      <Link to="/register">"Don't have an account? Sign Up"</Link>
    ) : (
      <Link to="/login">"Already have an account? Sign In"</Link>
    );
  };

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCheckbox = (e) => {
    setChecked(e.target.checked);
  };

  const renderEmailHelperText = () => {
    if (errors.email) {
      return "Email address is required.";
    }
    
    if (emailInvalid) {
      return "Email address is invalid.";
    }

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
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            {pathname === "/register" && (
              <TextField
                error={errors.name}
                helperText={errors.name && "Name is required."}
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                autoComplete="name"
                onChange={handleChange}
              />
            )}
            <TextField
              error={errors.email || emailInvalid}
              helperText={renderEmailHelperText()}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              onChange={handleChange}
            />
            <TextField
              error={errors.password}
              helperText={errors.password && "Password is required."}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handleChange}
            />
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
              onClick={handleSubmit}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <MuiLink variant="body2">Forgot password?</MuiLink>
              </Grid>
              <Grid item>
                <MuiLink variant="body2">{renderSwitchType()}</MuiLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
