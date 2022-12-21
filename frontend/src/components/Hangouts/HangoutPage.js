import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getHangoutByPath } from '../../utils/apiHelper'
import { useCurrentUser } from '../../utils/hooks'
import { parseDate } from '../../utils/date'
import placeholder from '../../assets/Placeholder_view_vector.svg'

import BackArrow from '../Misc/BackArrow'
import HangoutAttend from './HangoutAttend'
import HangoutPageFinalDetails from './HangoutPageFinalDetails'
import AvatarStack from '../Misc/AvatarStack'
import HangoutPageDateDisplay from './HangoutPageDateDisplay'

import Typography from '@mui/material/Typography'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import Box from '@mui/material/Box'
import WarningIcon from '@mui/icons-material/Warning'
import PageSkeleton from '../Misc/PageSkeleton'

const HangoutPage = () => {
  const { user } = useCurrentUser()
  const { hangoutPath } = useParams()
  const navigate = useNavigate()

  const {
    isLoading,
    error,
    data: hangout,
  } = useQuery(['hangout', hangoutPath], () => getHangoutByPath(hangoutPath))

  if (isLoading) {
    return <PageSkeleton />
  }

  if (error) {
    navigate('/error')
    console.log(error)
  }

  const attendees = hangout.attendees

  const renderButtonOrFinalDetails = () => {
    return hangout.finalized ? (
      <HangoutPageFinalDetails hangout={hangout}/>
    ) : (
      <HangoutAttend
        hangout={hangout}
        isPlanner={user._id === hangout.planner._id}
        isAttending={hangout.attendees.map((att) => att._id).includes(user._id)}
      />
    )
  }

  /**
   * if hangout has not been finalized yet and the earliest date option is in
   * less than 3 days, a warning will be shown
   */
  const renderWarning = () => {

    // get earliest date
    const datesSortedByChrono = Object.keys(hangout.dateOptions).sort((a, b) => {
      let optionA = new Date(a)
      let optionB = new Date(b)
      return optionA - optionB
    })

    const earliestDate = new Date(datesSortedByChrono[0])
    const expirationDate = earliestDate.setDate(earliestDate.getDate() - 1)

    // get date with most votes
    const datesSortedByVotes = Object.keys(hangout.dateOptions).sort((a, b) => {
      return hangout.dateOptions[b].length - hangout.dateOptions[a].length
    })

    const dateWithMostVotes = new Date(datesSortedByVotes[0])

    const today = new Date()
    const threeDaysAfter = today.setDate((new Date().getDate() + 3))

    if (!hangout.finalized && earliestDate < threeDaysAfter) {
      return (
        <Box sx={{
          paddingY: 4,
          paddingX: 3,
          border: '1px solid lightgray',
          width: '70%',
        }}>
          <Typography gutterBottom variant="h6" color="error" sx={{ display: 'inline-flex', verticalAlign: 'bottom' }}>
            <WarningIcon sx={{ marginRight: 1 }} /> It's almost time to hang out!
          </Typography>
          <Typography variant="subtitle1">
            Date selection and voting will no longer be available at this date:
          </Typography>
          <Typography gutterBottom variant="subtitle2" color="secondary">
            {parseDate(expirationDate)}
          </Typography>
          <Typography variant="subtitle1">
          If no action is taken, your hangout will be automatically scheduled for:
          </Typography>
          <Typography gutterBottom variant="subtitle2" color="secondary">
            {parseDate(dateWithMostVotes)}
          </Typography>
        </Box>
      )
    }
  }

  return (
    <Box mt={3}
    >
      <BackArrow link={`/groups/${hangout.groupPath}`} />

      <Typography variant="h3" component="h2" mt={3}>
        {hangout?.title}
      </Typography>

      <Typography gutterBottom variant="button" color="text.secondary">
        <LocationOnIcon fontSize="inherit" /> {hangout.location}
      </Typography>

      <br />
      <Box
        component="img"
        sx={{
          height: 250,
          maxHeight: { xs: 150, md: 200, lg: 250 },
        }}
        alt="hangout avatar"
        src={ hangout.avatar || placeholder }
      />
      <br />

      {user._id === hangout.planner._id && (
        <Link
          to="./edit"
          style={{
            color: 'blue',
            fontWeight: 500,
            textDecoration: 'underline',
          }}
        >
          Edit hangout details
        </Link>
      )}

      <Typography gutterBottom variant="h6" mt={4}>
        Description
      </Typography>
      <Typography gutterBottom variant="subtitle1" sx={{ whiteSpace: 'pre-wrap' }}>
        {hangout?.description}
      </Typography>

      <Typography gutterBottom variant="h5" mt={6} mb={3}>
        Attending ({attendees.length + 1})
      </Typography>

      <AvatarStack
        peopleList={attendees}
        admin={hangout.planner}
      />

      { renderWarning() }

      { !hangout.finalized &&
        <HangoutPageDateDisplay dateOptions={hangout.dateOptions} />
      }

      {renderButtonOrFinalDetails()}
    </Box>
  )
}

export default HangoutPage
