import Navbar from './Navbar'
import LandingPageFooter from './Footer'

import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Link from '@mui/material/Link'

const Error = () => {
  return (
    <>
      <Navbar />
      <Container maxWidth="sm" sx={{ marginTop: 20, minHeight: '60vh' }}>
        <Typography align="center" variant="h1">
          <Link color="inherit" underline="hover" href="https://en.wikipedia.org/wiki/HTTP_404" target="_blank" rel="noopener">404</Link>
        </Typography>
        <Typography gutterBottom align="center" variant="h2">Page not found</Typography>
        <Typography align="center" variant="h6">
          <Link href="/home">Nowhere else to go but home...</Link>
        </Typography>
      </Container>
      <LandingPageFooter />
    </>
  )
}

export default Error
