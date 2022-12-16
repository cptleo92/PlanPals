import Navbar from '../Misc/Navbar'
import hero from '../../assets/mason-dahl--7AxXbZekDE-unsplash.jpg'
import LandingPageAccordion from './LandingPageAccordion'
import LandingPageFooter from './LandingPageFooter'

import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Fade from '@mui/material/Fade'
import Container from '@mui/material/Container'

const LandingPage = () => {

  return (
    <>
      <Navbar landing />
      <Container maxWidth="lg" sx={{ minHeight: '70vh' }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          marginY: 8
        }}>
          <Fade in timeout={1000}>
            <Stack spacing={10} mr={10}>
              <Box>
                <Typography variant="h1" sx={{ fontFamily: 'Reem Kufi', fontSize: 70 }}>
                  Event planning
                </Typography>
                <Typography variant="h1" color='success.main' sx={{ fontFamily: 'Reem Kufi', fontSize: 70 }}>
                  simplified.
                </Typography>
              </Box>
              <Typography variant="h6" color='text.secondary'>
                Making it easier to navigate a busy world.
              </Typography>
            </Stack>
          </Fade>
          <Fade in timeout={3000}>
            <Box
              component="img"
              src={hero}
              alt="friends"
              sx={{
                height: 650,
                maxHeight: { xs: 350, md: 500, lg: 650 },
              }}
            >
            </Box>
          </Fade>
        </Box>
        <LandingPageAccordion />
      </Container>
      <LandingPageFooter />
    </>
  )
}

export default LandingPage