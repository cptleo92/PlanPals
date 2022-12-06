import React from 'react'

const GroupHangoutsListItem = ({ hangout }) => {
  return (
    <>
      <h2>{hangout.title}</h2>
      <p>{hangout.description}</p>
    </>
  )
}

export default GroupHangoutsListItem