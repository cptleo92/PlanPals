import { useCurrentUser } from '../../utils/hooks'

import Navbar from './Navbar'
import LandingPageFooter from './Footer'

import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Link from '@mui/material/Link'
import { useEffect } from 'react'

export default function Logout() {

  const { logoutUser } = useCurrentUser()

  useEffect(() => {
    logoutUser()
  }, [logoutUser])

  return (
    <>
      <Navbar />
      <Container maxWidth="sm" sx={{ marginTop: 20, minHeight: '60vh' }}>

        <Typography gutterBottom align="center" variant="h2">You've been logged out!</Typography>
        <Typography align="center" variant="h6">
          <Link href="/login">Sign back in</Link>
        </Typography>
      </Container>
      <LandingPageFooter />
    </>
  )
}