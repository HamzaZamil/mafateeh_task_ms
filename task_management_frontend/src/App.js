import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/home';
import Register from './components/register';
import NotFound from './pages/notFound';
import UnAuthorized from './pages/unauthorized';
import AddTask from './pages/addTask'; // Fixed Typo
import EditTask from './pages/editTask';
import Login from './components/login'; // Import the Login component


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} /> {/* Add this */}
          <Route path="/home" element={<Home />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/unauthorized" element={<UnAuthorized />} />
          <Route path="/addTask" element={<AddTask />} />
          <Route path="/editTask/:id" element={<EditTask />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
