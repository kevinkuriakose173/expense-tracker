import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);  // Loading state while checking authentication

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Make an API request to check if the user is authenticated
        const response = await axios.get('http://localhost:5000/api/auth/me', { withCredentials: true });
        console.log('User authenticated:', response.data);
        setIsAuthenticated(true);
      } catch (err) {
        setIsAuthenticated(false);  // Not authenticated
      } finally {
        setLoading(false);  // Stop loading once the check is complete
      }
    };

    checkAuth();
  }, [isAuthenticated]);

  if (loading) {
    return <div>Loading...</div>;  // Show a loading screen while checking authentication
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <RegisterPage isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />

        {/* Protected Route: Home page */}
        <Route path="/" element={isAuthenticated ? <HomePage setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
