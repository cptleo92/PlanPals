import HangoutAttendDatesForm from './HangoutAttendDatesForm'
import ButtonModal from '../Misc/ButtonModal'
import HangoutFinalizeForm from './HangoutFinalizeForm'

const HangoutAttend = ({ hangout, isPlanner, isAttending }) => {
  if (isPlanner) {
    return (
      <ButtonModal
        buttonText='Finalize Date'
        title="Choose a date for this hangout!"
        color="success"
      >
        <HangoutFinalizeForm
          dateOptions={hangout.dateOptions}
          id={hangout._id}
        />
      </ButtonModal>
    )
  } else {
    return (
      <ButtonModal
        buttonText={isAttending ? 'Edit RSVP' : 'RSVP'}
        title="Select at least 1 date that you are available!"
        color="secondary"
      >
        <HangoutAttendDatesForm
          dateOptions={hangout.dateOptions}
          id={hangout._id}
        />
      </ButtonModal>
    )
  }

}

export default HangoutAttend
