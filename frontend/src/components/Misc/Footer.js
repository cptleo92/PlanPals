import { Container, Box, Link, Stack, Typography, Divider } from '@mui/material'

import GitHubIcon from '@mui/icons-material/GitHub'
import LinkedInIcon from '@mui/icons-material/LinkedIn'

const LandingPageFooter = () => {
  return (

    <Box
      color="text.secondary"
      px={10}
      py={3}
      mt={6}
    >
      <Container maxWidth="lg">
        <Divider />
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-around',
          marginTop: 3
        }}>
          <Box sx={{ width: '30%' }}>
            <Link mx={2} href="#" color="inherit" underline="none">
                Features
            </Link>
            <Link mx={2} href="#" color="inherit" underline="none">
                Support
            </Link>
            <Link mx={2} href="#" color="inherit" underline="none">
                Contact
            </Link>
            <Link mx={2} href="#" color="inherit" underline="none">
                Careers
            </Link>
          </Box>


          <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 'auto', marginRight: 'auto' }}>
            {'Copyright © Leo Cheng '}
            {new Date().getFullYear()}
            {'.'}
          </Typography>


          <Box textAlign="right" sx={{ width: '30%', minWidth: 100 }}>
            <GitHubIcon sx={{ marginRight: 5 }} />
            <LinkedInIcon />
          </Box>
        </Box>
      </Container>
    </Box>

  )
}

export default LandingPageFooter
