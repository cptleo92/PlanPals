import { Container, Box, Link, Stack, Typography } from '@mui/material'

import GitHubIcon from '@mui/icons-material/GitHub'
import LinkedInIcon from '@mui/icons-material/LinkedIn'

const LandingPageFooter = () => {
  return (

    <Box
      color="text.secondary"
      px={10}
      py={5}
      mt={6}
      sx={{ backgroundColor: 'lightgray' }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3} mt={3}>
          <Box textAlign="center">
            <Link mx={5} href="#" color="inherit" underline="none">
                Features
            </Link>
            <Link mx={5} href="#" color="inherit" underline="none">
                Support
            </Link>
            <Link mx={5} href="#" color="inherit" underline="none">
                Contact
            </Link>
            <Link mx={5} href="#" color="inherit" underline="none">
                Careers
            </Link>
          </Box>

          <Box textAlign="center">
            <Link href="https://www.github.com/cptleo92" target="_blank" color="inherit">
              <GitHubIcon sx={{ marginRight: 8 }} />
            </Link>
            <Link href="https://www.linkedin.com/in/sirleoc" target="_blank" color="inherit">
              <LinkedInIcon />
            </Link>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary" align="center">
              {'Copyright © Leo Cheng '}
              {new Date().getFullYear()}
              {'.'}
            </Typography>
          </Box>
        </Stack>
      </Container>
    </Box>

  )
}

export default LandingPageFooter
