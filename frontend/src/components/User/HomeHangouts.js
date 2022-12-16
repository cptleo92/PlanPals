import GroupCard from '../Groups/GroupCard'
import NewGroupButton from '../Groups/NewGroupButton'

import Grid from '@mui/material/Unstable_Grid2'

const HomeHangouts = ({ userHangouts }) => {
  return (
    <>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} mb={2} mt={2}>
        {userHangouts.map((group) => (
          <Grid xs={2} sm={4} md={4} key={group._id}>
            <GroupCard group={group} />
          </Grid>
        ))}
      </Grid>

      <NewGroupButton />
    </>
  )
}

export default HomeHangouts