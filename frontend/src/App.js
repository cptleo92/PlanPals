import { useState, useEffect, createContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthRoutes, ProtectedRoutes } from './utils/routesAuth'
import axios from 'axios'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GoogleOAuthProvider } from '@react-oauth/google'

import UserForm from './components/User/UserForm'
import Layout from './Layout'
import Home from './components/User/Home'
import GroupForm from './components/Groups/GroupForm'
import Logout from './components/Misc/Logout'
import HangoutPage from './components/Hangouts/HangoutPage'
import UserPasswordReset from './components/User/UserPasswordReset'
import UserPasswordResetNewForm from './components/User/UserPasswordResetNewForm'

// history router, used for redirecting in axios interceptors
import { createBrowserHistory } from 'history'
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom'
import GroupPage from './components/Groups/GroupPage'
import Error from './components/Misc/Error'
import HangoutForm from './components/Hangouts/HangoutForm'
import LandingPage from './components/Landing/LandingPage'
import NotificationPage from './components/Misc/NotificationPage'
import UserPage from './components/User/UserPage'

import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

let history = createBrowserHistory()

// axios configs
axios.interceptors.request.use(function (config) {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'))
  if (currentUser?.token)
    config.headers.Authorization = `Bearer ${currentUser.token}`

  return config
})

axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
  },
  function (error) {
    if (
      error.response.status === 401 &&
      error.response.data.error === 'Token expired'
    ) {
      console.log('Token expired. Redirecting...')
      history.replace('/logout')
    }
    return Promise.reject(error)
  }
)

export const UserContext = createContext()
export const DarkModeContext = createContext()

const queryClient = new QueryClient()

function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('currentUser'))
  )
  const loggedIn = Boolean(user)

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('currentUser')))
  }, [])

  const logoutUser = () => {
    queryClient.removeQueries()
    localStorage.removeItem('currentUser')
    setUser(null)
    history.push('/')
  }

  const [darkMode, setDarkMode] = useState(!!JSON.parse(localStorage.getItem('darkMode')) || false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    localStorage.setItem('darkMode', !darkMode)
  }

  const darkTheme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <UserContext.Provider value={{ user, setUser, logoutUser }}>

        <HistoryRouter history={history}>
          <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <ThemeProvider theme={darkTheme}>
              <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
                <CssBaseline />
                <Routes>
                  <Route element={<AuthRoutes loggedIn={loggedIn} />}>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<UserForm />} />
                    <Route path="/register" element={<UserForm />} />
                    <Route path="/login/:groupPath" element={<UserForm />} />
                    <Route path="/register/:groupPath" element={<UserForm />} />
                    <Route path="/passwordReset" element={<UserPasswordReset />} />
                    <Route path="/passwordReset/:token/:id" element={<UserPasswordResetNewForm />} />
                  </Route>

                  <Route element={<Layout />}>
                    <Route element={<ProtectedRoutes loggedIn={loggedIn} />}>
                      <Route path="/home" element={<Home />} />
                      <Route path="/user" element={<UserPage />} />
                      <Route path="/notifications" element={<NotificationPage />} />
                      <Route path="/groups/create" element={<GroupForm />} />
                      <Route path="/groups/:groupPath/edit" element={<GroupForm edit />} />
                      <Route path="groups/:groupPath/hangouts/create" element={<HangoutForm />} />
                      <Route path="groups/:groupPath/hangouts/:hangoutPath" element={<HangoutPage />} />
                      <Route path="groups/:groupPath/hangouts/:hangoutPath/edit" element={<HangoutForm edit />} />
                    </Route>
                    <Route path="/groups/:groupPath" element={<GroupPage />} />

                  </Route>
                  <Route path="/error" element={<Error />} />
                  <Route path="/logout" element={<Logout />} />

                  <Route path='*' element={<Error />} />
                </Routes>
              </DarkModeContext.Provider>
            </ThemeProvider>
          </GoogleOAuthProvider>
        </HistoryRouter>
      </UserContext.Provider>
    </QueryClientProvider>
  )
}

export default App
