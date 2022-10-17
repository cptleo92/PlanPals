import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

import { Link, useNavigate } from 'react-router-dom'



export default function Navbar() {
  const navigate = useNavigate()

  const handleLoginNav = () => {
    navigate('login')
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/">PlanPals</Link>
          </Typography>         
          <Button color="inherit" onClick={handleLoginNav}>Login</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
