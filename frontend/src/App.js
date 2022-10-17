import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from "./components/Navbar";
import UserForm from './components/UserForm';

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<div>Root</div>} />
          <Route path='/login' element={<UserForm />} />
          <Route path='/register' element={<UserForm />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
