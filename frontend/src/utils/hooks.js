import { useContext } from 'react'
import { UserContext } from '../App'

export const useCurrentUser = () => useContext(UserContext)

