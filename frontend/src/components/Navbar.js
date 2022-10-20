// import { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { Link, useNavigate } from 'react-router-dom'

export default function Navbar({ user, setUser }) {  
  const navigate = useNavigate()

  const handleUserNav = (e) => {
    navigate(`/${e.target.name}`)
  }

  const logoutUser = () => {
    window.localStorage.removeItem('currentUser')
    setUser(null)
  }

  const userButtons = () => {
    if (user) {
      return (
        <Button name="login" color="inherit" onClick={logoutUser}>Logout</Button>
      )
    }
    return (
      <>
        <Button name="login" color="inherit" onClick={handleUserNav}>Login</Button>
        <Button name="register" color="inherit" onClick={handleUserNav}>Register</Button>
      </>
    )
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>         
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/">PlanPals</Link>
          </Typography>         
            { userButtons() }
        </Toolbar>
      </AppBar>
    </Box>
  );
}
