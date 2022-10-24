import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Container from "@mui/material/Container";

function Layout() {
  return (
    <>
      <Navbar />
      <Container maxWidth="md">
        <Outlet />
      </Container>
    </>
  );
}

export default Layout;