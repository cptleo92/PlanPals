import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<div>Root</div>} />
          <Route path='/login' element={<div>login</div>} />
          <Route path='/register' element={<div>register</div>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
