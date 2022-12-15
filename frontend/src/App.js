import { useState, useEffect, createContext } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { AuthRoutes, ProtectedRoutes } from './utils/routesAuth'
import axios from 'axios'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import UserForm from './components/User/UserForm'
import Layout from './Layout'
import Home from './components/User/Home'
import GroupForm from './components/Groups/GroupForm'
import Loading from './components/Misc/Loading'
import HangoutPage from './components/Hangouts/HangoutPage'

// history router, used for redirecting in axios interceptors
import { createBrowserHistory } from 'history'
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom'
import GroupPage from './components/Groups/GroupPage'
import Error from './components/Misc/Error'
import HangoutForm from './components/Hangouts/HangoutForm'
import LandingPage from './components/Landing/LandingPage'

let history = createBrowserHistory()

// axios configs
axios.interceptors.request.use(function (config) {
  const currentUser = JSON.parse(window.localStorage.getItem('currentUser'))
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
      history.replace('/session-expired')
    }
    return Promise.reject(error)
  }
)

export const UserContext = createContext()

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
    window.localStorage.removeItem('currentUser')
    setUser(null)
  }

  return (
    <QueryClientProvider client={queryClient}>
      <UserContext.Provider value={{ user, setUser, logoutUser }}>
        <HistoryRouter history={history}>
          <Routes>
            <Route element={<AuthRoutes loggedIn={loggedIn} />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<UserForm />} />
              <Route path="/register" element={<UserForm />} />
            </Route>

            <Route element={<Layout />}>
              <Route element={<ProtectedRoutes loggedIn={loggedIn} />}>
                <Route path="/home" element={<Home />} />
                <Route path="/groups/create" element={<GroupForm />} />
                <Route path="/groups/:groupPath" element={<GroupPage />} />
                <Route path="/groups/:groupPath/edit" element={<GroupForm edit />} />
                <Route path="groups/:groupPath/hangouts/create" element={<HangoutForm />} />
                <Route path="groups/:groupPath/hangouts/:hangoutPath" element={<HangoutPage />} />
                <Route path="groups/:groupPath/hangouts/:hangoutPath/edit" element={<HangoutForm edit />} />
              </Route>

              <Route path="/error" element={<Error />} />
            </Route>

            <Route path="/session-expired" element={<Loading redirect />} />
            <Route path='*' element={<Error />} />
          </Routes>
        </HistoryRouter>
      </UserContext.Provider>
    </QueryClientProvider>
  )
}

export default App
