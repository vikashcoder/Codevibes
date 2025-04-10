
import React from 'react';
import './SessionHeader.css';

const SessionHeader = ({
  isInSession,
  creator,
  sessionId,
  user,
  showDropdown,
  setShowDropdown,
  setShowProfileModal,
  handleLogout
}) => {
  return (
    isInSession && (
      <div className="session-header">
        {creator && (
          <div className="creator-info">
            <img
              src={creator.avatar}
              alt="Creator Avatar"
              className="creator-avatar"
            />
            <span className="creator-username">{creator.username}</span>
          </div>
        )}

        <div className="session-id">
          Session ID: <strong>{sessionId}</strong>
        </div>

        {user && (
          <div className="user-dropdown">
            <img
              src={user.avatar}
              alt="User Avatar"
              className="user-avatar"
              onClick={() => setShowDropdown(!showDropdown)}
            />
            {showDropdown && (
              <div className="dropdown-menu">
                <button
                  onClick={() => {
                    setShowProfileModal(true);
                    setShowDropdown(false);
                  }}
                  className="dropdown-item"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="dropdown-item logout"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    )
  );
};

export default SessionHeader;
