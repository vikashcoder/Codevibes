
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

const Profile = ({ token }) => {
  const [user, setUser] = useState({ username: '', avatar: '', gender: 'male' });
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setNewUsername(res.data.username);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchUser();
  }, [token]);

  const handleEdit = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}api/auth/profile`,
        { username: newUsername },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data);
      setIsEditing(false);
    } catch (error) {
      alert('Error updating profile: ' + error.message);
    }
  };

  return (
    <div className="profile-container">
      <img
        src={user.avatar}
        alt="User Avatar"
        className="profile-avatar"
      />
      {isEditing ? (
        <input
          type="text"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          className="profile-input"
        />
      ) : (
        <h3 className="profile-username">{user.username}</h3>
      )}
      <p className="profile-gender">Gender: {user.gender}</p>
      <button onClick={handleEdit} className="profile-button">
        {isEditing ? 'Save' : 'Edit Profile'}
      </button>
    </div>
  );
};

export default Profile;
