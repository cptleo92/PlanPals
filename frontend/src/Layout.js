import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';

function Layout({ user, setUser }) {
  return (
    <>
      <Navbar user={user} setUser={setUser} />
      <Outlet />
    </>
  );
}

export default Layout;