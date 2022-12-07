import { Link } from "react-router-dom";

const GroupHangoutsListItem = ({ hangout }) => {
  return (
    <>
      <Link to={`./hangouts/${hangout.path}`}>{hangout.title}</Link>
      <p>{hangout.description}</p>
    </>
  )
}

export default GroupHangoutsListItem