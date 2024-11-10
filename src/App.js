import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Login';
import Signup from './Signup';
import HomePage from './HomePage'; // Protected page component

const App = () => {
  // Simulating an authentication status (for now, replace this with real authentication logic)
  const isAuthenticated = false; // change this to true when user is logged in

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected Route */}
        <Route path="/home" element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route path="/home" element={<HomePage />} />
        </Route>
        
        {/* Default Redirect */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

// ProtectedRoute component to guard private routes
const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (isAuthenticated) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
};

export default App;
