import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Footer from './components/Footer/Footer'

function Layout() {
  return (
    <>
      <Navbar />
      <Box pb={10}>
        <Container
          maxWidth="md"
        // sx={{
        //   display: 'flex',
        //   flexDirection: 'column',
        //   justifyContent: 'space-between',
        //   minHeight: '100vh'
        // }}
        >
          <Outlet />
          {/* <Footer /> */}
        </Container>
      </Box>
    </>
  )
}

export default Layout
