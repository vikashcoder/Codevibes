import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';

const Auth = ({ setToken, setErrorMessage }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('male');
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin ? '/api/auth/login' : '/api/auth/register';
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}${url}`, {
        username,
        password,
        ...(isLogin ? {} : { email, gender }),
      });
      if (isLogin) {
        setToken(res.data.token);
      } else {
        setErrorMessage('Registered successfully! Please log in.');
        setTimeout(() => setErrorMessage(''), 3000);
        setUsername('');
        setPassword('');
        setEmail('');
        setIsLogin(true);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Something went wrong';
      setErrorMessage(errorMsg);
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
          {!isLogin && (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          )}
          <div className="password-fields">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <span
              className="password-toggle-icons"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '👁️‍🗨️' : '👁️'}
            </span>
          </div>
          {!isLogin && (
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          )}
          <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
        </form>
        <button onClick={() => setIsLogin(!isLogin)} className="switch-btn">
          Switch to {isLogin ? 'Register' : 'Login'}
        </button>
      </div>
    </div>
  );
};

export default Auth;