import { Container, Box, Link, Typography, Divider } from '@mui/material'

import GitHubIcon from '@mui/icons-material/GitHub'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import EmailIcon from '@mui/icons-material/Email'

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
          {/* <Box sx={{ width: '30%' }}>
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
          </Box> */}


          <Typography variant="body2" color="text.secondary" sx={{ marginRight: 'auto' }}>
            {'Copyright © Leo Cheng '}
            {new Date().getFullYear()}
            {'.'}
          </Typography>


          <Box textAlign="right" sx={{ width: '30%', minWidth: 200 }}>
            <Link href="mailto:leo.cheng92@gmail.com" color="inherit" sx={{ marginRight: 8 }}>
              <EmailIcon />
            </Link>
            <Link href="https://www.github.com/cptleo92" target="_blank" color="inherit" sx={{ marginRight: 8 }} >
              <GitHubIcon />
            </Link>
            <Link href="https://www.linkedin.com/in/sirleoc" target="_blank" color="inherit">
              <LinkedInIcon />
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>

  )
}

export default LandingPageFooter
