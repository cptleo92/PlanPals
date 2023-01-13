import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'

const UserPage = () => {
  return (
    <Container maxWidth="md">
      <Box mt={5}>
        <Avatar sx={{
          width: 250,
          height: 250,
        }}
        >
        </Avatar>
      </Box>
    </Container>
  )
}

export default UserPage