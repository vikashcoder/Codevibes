
import React from 'react';
import './JoinSession.css';

const JoinSession = ({ sessionId, setSessionId, handleSessionSubmit }) => {
  return (
    <div className="join-session-container">
      <h2 className="join-session-title">Join or Create Session</h2>
      <form onSubmit={handleSessionSubmit} className="join-session-form">
        <input
          type="text"
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
          placeholder="Enter Session ID (e.g., room1)"
          className="join-session-input"
        />
        <button
          type="submit"
          className="join-session-button"
        >
          Join / Create
        </button>
      </form>
    </div>
  );
};

export default JoinSession;
