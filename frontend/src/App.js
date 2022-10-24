import { useState, useEffect, createContext } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthRoutes, ProtectedRoutes } from "./utils/routesAuth";
import axios from "axios";

import UserForm from "./components/UserForm";
import Layout from "./Layout";
import Home from "./components/Home";
import NewGroupForm from "./components/NewGroupForm";

// history router, used for redirecting in axios interceptors
import { createBrowserHistory } from "history";
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";

let history = createBrowserHistory();

// axios configs
axios.interceptors.request.use(function (config) {
  const currentUser = JSON.parse(window.localStorage.getItem("currentUser"));
  if (currentUser?.token)
    config.headers.Authorization = `Bearer ${currentUser.token}`;

  return config;
});

axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    if (
      error.response.status === 401 &&
      error.response.data.error === "Token expired"
    ) {
      console.log("redirecting?");
      window.localStorage.removeItem("currentUser");
      history.replace("/");
    }
    return Promise.reject(error);
  }
);

export const UserContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  const loggedIn = Boolean(user);

  useEffect(() => {
    const currentUser = window.localStorage.getItem("currentUser");
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
  }, []);

  const logoutUser = () => {
    window.localStorage.removeItem("currentUser");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logoutUser }}>
      <HistoryRouter history={history}>
        <Routes>
          <Route element={<Layout />}>
            <Route element={<AuthRoutes loggedIn={loggedIn} />}>
              <Route path="/" element={<div>This is front page</div>} />
              <Route path="/login" element={<UserForm />} />
              <Route
                path="/register"
                element={<UserForm />}
              />
            </Route>

            <Route element={<ProtectedRoutes loggedIn={loggedIn} />}>
              <Route path="/home" element={<Home />} />
              <Route path="/groups/create" element={<NewGroupForm />} />
            </Route>
          </Route>
        </Routes>
      </HistoryRouter>
    </UserContext.Provider>
  );
}

export default App;
