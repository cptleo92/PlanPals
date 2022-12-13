import { parseDate } from '../../utils/date'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const HangoutPageFinalDetails = ({ hangout }) => {
  return (
    <Box>
      <Typography>
        This hangout has been officially scheduled for:
      </Typography>
      <Typography>
        {parseDate(hangout.finalDate)}
      </Typography>
    </Box>
  )
}

export default HangoutPageFinalDetails