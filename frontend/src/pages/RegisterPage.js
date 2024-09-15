import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function RegisterPage({ isAuthenticated, setIsAuthenticated }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors

    try {
      // Send a POST request to the backend
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        username,
        email,
        password,
      }, { withCredentials: true }); // withCredentials allows sending cookies with the request
      console.log(response.data)
      setIsAuthenticated(true);
      navigate('/'); // Navigate to home page on successful registration
    } catch (err) {
      setError('Failed to register'); // Display error message
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');  // Redirect to home page if already authenticated
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="container my-5">
      <h1 className="mb-4 text-center">Register</h1>

      {/* Display error message if exists */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Register Form */}
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3 w-100">
          <label className="w-100">
            Username
            <input
              type="text"
              className="form-control"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
        </div>
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
        <button type="submit" className="btn btn-primary w-100">Register</button>
      </form>

      {/* Link to login page */}
      <p className="mt-3 text-center">
        Already have an account? <Link to="/login">Login here</Link>.
      </p>
    </div>
  );
}

export default RegisterPage;
