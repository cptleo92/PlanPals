import * as React from 'react';
import { useNavigate } from 'react-router-dom'

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { UserContext } from '../App';

export default function Loading({ redirect }) {
  const navigate = useNavigate()
  const { logoutUser } = React.useContext(UserContext)

  React.useEffect(() => {
    if (redirect) {
      window.localStorage.removeItem('currentUser')
      logoutUser();
      navigate('/login')
    }
  })

  return (
    <div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}