import HangoutsListItem from './HangoutsListItem'

const HangoutsList = ({ hangouts, past }) => {
  return (
    <>

      {
        hangouts.map(hangout => <HangoutsListItem past={past} hangout={hangout} key={hangout._id} />)
      }

    </>
  )
}

export default HangoutsList