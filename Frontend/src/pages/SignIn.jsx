import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './SignIn.css';


const SignIn = () => { 
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [message, setMessage] = useState(''); 

  const navigate = useNavigate(); 

  const API_BASE_URL = 'http://localhost:3000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); 

    const endpoint = isSignUp ? `${API_BASE_URL}/auth/register` : `${API_BASE_URL}/auth/login`;
    const method = 'POST';
    const body = JSON.stringify({ username, password });

    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || (isSignUp ? 'Sign up successful!' : 'Login successful!'));
        if (data.token) {
          localStorage.setItem('jwtToken', data.token); 
          console.log('JWT Token stored:', data.token);
          navigate('/'); 
        }
      } else {
        setMessage(data.error || 'An error occurred.');
        console.error('API Error:', data.error);
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
      console.error('Fetch error:', error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Toggle between Sign Up and Login */}
        <h2 className="auth-title">
          {isSignUp ? 'SIGN UP' : 'LOGIN'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text" 
              id="username"
              className="form-input"
              placeholder="Enter your username"
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="Enter your password"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
            />
          </div>

          <button
            type="submit"
            className="submit-button"
          >
            {isSignUp ? 'SIGN UP' : 'LOGIN'}
          </button>
        </form>

        {message && <p className="auth-message">{message}</p>} {/* Display messages */}

        <div className="auth-toggle-text">
          {isSignUp ? (
            <>
              Already a user?{' '}
              <a
                href="#"
                onClick={() => { setIsSignUp(false); setMessage(''); }} 
                className="auth-toggle-link"
              >
                LOGIN
              </a>
            </>
          ) : (
            <>
              Need an account?{' '}
              <a
                href="#"
                onClick={() => { setIsSignUp(true); setMessage(''); }} 
                className="auth-toggle-link"
              >
                SIGN UP
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
