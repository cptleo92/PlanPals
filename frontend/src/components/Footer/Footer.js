import { Container, Box, Link, Stack, Typography } from '@mui/material'

import GitHubIcon from '@mui/icons-material/GitHub'
import LinkedInIcon from '@mui/icons-material/LinkedIn'

const Footer = () => {
  return (
    <footer>
      <Box
        color="text.secondary"
        px={10}
        py={10}

      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
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
              <GitHubIcon sx={{ marginRight: 8 }} />
              <LinkedInIcon />
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
    </footer>
  )
}

export default Footer
