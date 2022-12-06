import GroupHangoutsListItem from "./GroupHangoutsListItem"

const GroupHangoutsList = ({ hangouts }) => {
  return (
    <>
      {
        hangouts.map(hangout => <GroupHangoutsListItem hangout={hangout} key={hangout._id} />)
      }
    </>
  )
}

export default GroupHangoutsList