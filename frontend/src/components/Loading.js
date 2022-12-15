import { useEffect, useContext } from "react"
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from 'react-router-dom'

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { UserContext } from '../App';

export default function Loading({ redirect }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { logoutUser } = useContext(UserContext)

  useEffect(() => {
    if (redirect) {
      window.localStorage.removeItem('currentUser')
      logoutUser();
      queryClient.removeQueries()
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