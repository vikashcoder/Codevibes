import React, { useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';
import './Chat.css';

const socket = io(`${process.env.REACT_APP_API_BASE_URL}`, { autoConnect: false });

const Chat = ({ sessionId, token }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const userId = token ? jwtDecode(token).id : null;

  useEffect(() => {
    if (!socket.connected) socket.connect();
    socket.emit('joinSession', sessionId);

    socket.on('receiveMessage', ({ username, message, userId: senderId }) => {
      setMessages((prev) => [...prev, { username, message, userId: senderId }]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [sessionId]);

  const sendMessage = useCallback(() => {
    if (message.trim()) {
      socket.emit('sendMessage', { sessionId, message, userId });
      setMessage('');
    }
  }, [message, sessionId, userId]);

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((msg, idx) => {
          const isCurrentUser = msg.userId === userId;
          return (
            <div key={idx} className={`message-container ${isCurrentUser ? 'sent' : 'received'}`}>
              <div className="message-bubble">
                <span className="message-username">{msg.username}</span>
                <span className="message-text">{msg.message}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage} className="send-btn">🚀</button>
      </div>
    </div>
  );
};

export default Chat;
