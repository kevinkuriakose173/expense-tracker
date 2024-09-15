import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function LoginPage({ isAuthenticated, setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors

    try {
      // Send a POST request to the backend
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      }, { withCredentials: true }); // withCredentials allows sending cookies with the request
      console.log(response.data);
      // If successful, navigate to the home page
      setIsAuthenticated(true);
    } catch (err) {
      // If there's an error, set the error message
      console.log('didnt work');
      setError('Invalid email or password');
      
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');  // Redirect to home page
    }
  }, [isAuthenticated, navigate]);


  return (
    <div className="container my-5">
      <h1 className="mb-4 text-center">Login</h1>

      {/* Display error message if exists */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Login Form */}
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label className="w-100">
            Email
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
        </div>
        <div className="form-group mb-3">
          <label className="w-100">Password
          <div className="input-group">
            <input
              type={showPassword ? 'text' : 'password'}  // Toggle input type between password and text
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowPassword(!showPassword)}  // Toggle showPassword state
            >
              {showPassword ? 'Hide' : 'Show'}  {/* Change button text */}
            </button>
          </div>
          </label>
        </div>
        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>

      {/* Link to registration page */}
      <p className="mt-3 text-center">
        Don't have an account? <Link to="/register">Register here</Link>.
      </p>
    </div>
  );
}

export default LoginPage;
