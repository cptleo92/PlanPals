import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserForm from "./components/UserForm";
import { AuthRoutes, ProtectedRoutes } from "./utils/routesAuth";

import Layout from "./Layout";
import Home from "./components/Home"
import NewGroupForm from "./components/NewGroupForm";

function App() {
  const [user, setUser] = useState(null);
  const loggedIn = Boolean(user);

  useEffect(() => {
    const currentUser = window.localStorage.getItem("currentUser");
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route element={<Layout user={user} setUser={setUser} />}>

            <Route element={<AuthRoutes loggedIn={loggedIn} />}>
              <Route path="/" element={<div>This is front page</div>} />
              <Route path="/login" element={<UserForm setUser={setUser} />} />
              <Route
                path="/register"
                element={<UserForm setUser={setUser} />}
              />
            </Route>

            <Route element={<ProtectedRoutes loggedIn={loggedIn} />}>
              <Route path="/home" element={<Home user={user}/>} />
              <Route path="/groups/create" element={<NewGroupForm />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
