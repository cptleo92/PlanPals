import { useContext } from 'react'
import { DarkModeContext, UserContext } from '../App'

export const useCurrentUser = () => useContext(UserContext)
export const useDarkMode = () => useContext(DarkModeContext)

