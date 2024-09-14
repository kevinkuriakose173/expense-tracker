import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function RegisterPage({ isAuthenticated, setIsAuthenticated }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      console.log(response.data);
      setIsAuthenticated(true);
      // If successful, navigate to the home page
    } catch (err) {
      // If there's an error, set the error message
      setError('Failed to register');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');  // Redirect to home page
    }
  }, [isAuthenticated, navigate]);

  return (
    <div>
      <h1>Register</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            Username
          </label>
        </div>
        <div>
          <label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            Email
          </label>
        </div>
        <div>
          <label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            Password
          </label>
        </div>
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login here</Link>.
      </p>
    </div>
  );
}

export default RegisterPage;
