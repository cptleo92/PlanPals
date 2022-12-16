import React from 'react'
import { Outlet, Navigate } from 'react-router'

export const ProtectedRoutes = ({ loggedIn }) => {
  return loggedIn ? <Outlet /> : <Navigate to="/" />
}

export const AuthRoutes = ({ loggedIn }) => {
  return !loggedIn ? <Outlet /> : <Navigate to="/home" />
}