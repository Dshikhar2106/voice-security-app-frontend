import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider, useAuth } from './_context/AuthContext'; // Import the AuthContext
import Login from './Login';
import Signup from './Signup';
import HomePage from './HomePage'; // Protected page component
import ProfilePage from './ProfilePage';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Route */}
          <Route path="/home" element={<ProtectedRoute />}>
            <Route path="/home" element={<HomePage />} />
          </Route>

            <Route path="/profile" element={<ProfilePage />} />

          {/* Default Redirect */}
          <Route path="/" element={<RedirectRoute />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

// ProtectedRoute component to guard private routes
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated || localStorage.getItem('token')) {
    return <HomePage />;
  } else {
    return <Navigate to="/login" />;
  }
};

// Default redirect based on authentication
const RedirectRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />;
};

export default App;
