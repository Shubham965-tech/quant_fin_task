import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Removed useNavigate from import
import HomePage from './pages/HomePage';
import SignIn from './pages/SignIn';

// Main App component
const App = () => {
  return (
    <Router> 
      <Routes> 
        <Route path="/" element={<HomePage />} /> 
        <Route path="/signin" element={<SignIn />} /> 
      </Routes>
    </Router>
  );
};

export default App;
