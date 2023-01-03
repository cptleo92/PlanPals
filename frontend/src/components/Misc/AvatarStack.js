import { useState, useEffect } from 'react'

import Avatar from '@mui/material/Avatar'
import Stack from '@mui/material/Stack'

/**
 * https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array/6274381#6274381
 *
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
/**
 *  https://stackoverflow.com/questions/36862334/get-viewport-window-height-in-reactjs
 *
 *  gets window size to dynamically set how many avatars to render
 */
function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window
  return {
    width,
    height
  }
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions())

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowDimensions
}


const AvatarStack = ({ peopleList, admin }) => {
  const { width } = useWindowDimensions()
  const numberAvatars = Math.floor(width / 80)

  if (peopleList.length > numberAvatars) {
    peopleList = shuffle(peopleList).slice(0, numberAvatars)
  }

  const generateAvatars = () => {
    return peopleList.map((att) => <Avatar key={att._id}>{att.firstName[0] + att.lastName[0]}</Avatar>)
  }

  return (
    <Stack direction="row" spacing={2} mb={3}>
      <Avatar sx={{ width: 75, height: 75, marginBottom: 3 }}>
        {admin.firstName[0] + admin.lastName[0]}
      </Avatar>
      {generateAvatars()}
    </Stack>
  )
}

export default AvatarStack