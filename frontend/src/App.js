
import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import CodeEditor from './components/CodeEditor';
import Chat from './components/Chat';
import ProfileModal from './components/ProfileModal';
import SessionHeader from './components/SessionHeader';
import JoinSession from './components/JoinSession';
import axios from 'axios';
import './App.css';

const App = () => {
  const [token, setToken] = useState(null);
  const [sessionId, setSessionId] = useState('');
  const [isInSession, setIsInSession] = useState(false);
  const [creator, setCreator] = useState(null);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (token) {
      const fetchUser = async () => {
        try {
          const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/auth/profile`, {

            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data);
        } catch (error) {
          console.error('Error fetching user:', error);
          setErrorMessage('Failed to fetch profile');
          setTimeout(() => setErrorMessage(''), 3000);
        }
      };
      fetchUser();
    }
  }, [token]);

  const handleSessionSubmit = async (e) => {
    e.preventDefault();
    if (!sessionId.trim()) {
      setErrorMessage('Please enter a session ID');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/sessions/join`, 
        { sessionId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCreator(res.data.creator);
      setIsInSession(true);
    } catch (error) {
      if (error.response?.status === 404) {
        // const res = await axios.post(
        //   'http://localhost:5000/api/sessions/create',
        //   { sessionId },
        //   { headers: { Authorization: `Bearer ${token}` } }
        // );
        setCreator({ username: user?.username, avatar: user?.avatar });
        setIsInSession(true);
      } else {
        setErrorMessage(error.response?.data?.message || 'Session error');
        setTimeout(() => setErrorMessage(''), 3000);
      }
    }
  };

  const handleLogout = () => {
    setToken(null);
    setIsInSession(false);
    setSessionId('');
    setCreator(null);
    setShowDropdown(false);
  };

  return (
    <div className="app-container">
      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}

      {!token ? (
        <Auth setToken={setToken} setErrorMessage={setErrorMessage} />
      ) : (
        <>
          <SessionHeader
            isInSession={isInSession}
            creator={creator}
            sessionId={sessionId}
            user={user}
            showDropdown={showDropdown}
            setShowDropdown={setShowDropdown}
            setShowProfileModal={setShowProfileModal}
            handleLogout={handleLogout}
          />

          <ProfileModal
            user={user}
            token={token}
            showProfileModal={showProfileModal}
            setShowProfileModal={setShowProfileModal}
            setUser={setUser}
            setShowDropdown={setShowDropdown}
          />

          {!isInSession && (
            <JoinSession
              sessionId={sessionId}
              setSessionId={setSessionId}
              handleSessionSubmit={handleSessionSubmit}
            />
          )}

          {isInSession && (
            <div className="session-container">
              <div className="code-editor-container">
                <CodeEditor sessionId={sessionId} token={token} />
              </div>
              <div className="chat-container">
                <Chat sessionId={sessionId} token={token} />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;
