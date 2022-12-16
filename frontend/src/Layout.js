import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Footer from './components/Misc/Footer'

function Layout() {
  return (
    <>
      <Navbar />
      <Box pb={10} sx={{ minHeight: '100vh' }}>
        <Container
          maxWidth="md"
        >
          <Outlet />
        </Container>
      </Box>
      <Footer />
    </>
  )
}

export default Layout
