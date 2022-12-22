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

const AvatarStack = ({ peopleList, admin }) => {
  // if list > 8, shuffle and truncate
  if (peopleList.length > 8) {
    peopleList = shuffle(peopleList).slice(0, 8)
  }

  const generateAvatars = () => {
    return peopleList.map((att) => <Avatar key={att._id}>{att.firstName[0] + att.lastName[0]}</Avatar>)
  }

  return (
    <Stack direction="row" spacing={2} mb={3}>
      <Avatar sx={{ width: 75, height: 75 }}>
        {admin.firstName[0] + admin.lastName[0]}
      </Avatar>
      {generateAvatars()}
    </Stack>
  )
}

export default AvatarStack