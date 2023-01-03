import { useCurrentUser } from '../../utils/hooks'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

const HangoutPageDateDisplay = ({ dateOptions }) => {
  const { user } = useCurrentUser()

  const dates = Object.keys(dateOptions).sort((a, b) => {
    let optionA = new Date(a)
    let optionB = new Date(b)
    return optionA - optionB
  })

  const getNumberOfVotes = (date) => {
    return dateOptions[date].length
  }

  return (
    <TableContainer component={Paper} sx={{ width: '100%', marginY: 4 }}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Tentative Dates</TableCell>
            <TableCell align="right">Number of Votes</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dates.map((date) => (
            <TableRow
              key={date}
              sx={{
                backgroundColor: dateOptions[date].includes(user._id) ? 'lightgreen' : ''
              }}
            >
              <TableCell component="th" scope="row">
                {date}
              </TableCell>
              <TableCell align="right">{getNumberOfVotes(date)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default HangoutPageDateDisplay