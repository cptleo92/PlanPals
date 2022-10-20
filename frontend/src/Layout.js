import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Container from "@mui/material/Container";

function Layout({ user, setUser }) {
  return (
    <>
      <Navbar user={user} setUser={setUser} />
      <Container maxWidth="md">
        <Outlet />
      </Container>
    </>
  );
}

export default Layout;