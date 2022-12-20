import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import BackArrow from './BackArrow'

const PageSkeleton = () => {
  return (
    <Stack mt={3}>
      <BackArrow link={'/home'} />

      <Typography variant="h3" mt={3}>
        <Skeleton />
      </Typography>

      <Skeleton
        height={350}
        width='40%'
      />

      <Skeleton
        height={200}
        width='100%'
        sx={{ marginY: -5 }}
      />

      <Skeleton
        height={'40vh'}
        width='70%'
        sx={{ marginY: -5 }}
      />

    </Stack>
  )
}

export default PageSkeleton