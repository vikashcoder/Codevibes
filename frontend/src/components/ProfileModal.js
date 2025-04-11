import React, { useState } from 'react';
import axios from 'axios';
import BASE_URL from '../config'; // 👈 BASE_URL import
import './ProfileModal.css';

const ProfileModal = ({
  user,
  token,
  showProfileModal,
  setShowProfileModal,
  setUser,
  setShowDropdown,
}) => {
  const [newUsername, setNewUsername] = useState(user?.username || '');
  const [newEmail, setNewEmail] = useState(user?.email || 'Not set');
  const [newGender, setNewGender] = useState(user?.gender || 'male');
  const [newAvatar, setNewAvatar] = useState(null);
  const [password, setPassword] = useState('');
  const [editField, setEditField] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleProfileUpdate = async () => {
    if (!password) {
      setErrorMessage('Please enter your password to confirm changes.');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    try {
      const formData = new FormData();
      formData.append('username', newUsername);
      formData.append('email', newEmail === 'Not set' ? '' : newEmail);
      formData.append('gender', newGender);
      formData.append('password', password);
      if (newAvatar) formData.append('avatar', newAvatar);

      const res = await axios.put(
        `${BASE_URL}api/auth/profile`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
      );
      setUser(res.data);
      setShowProfileModal(false);
      setShowDropdown(false);
      setPassword('');
      setNewAvatar(null);
      setEditField(null);
    } catch (error) {
      console.error('Profile update error:', error.response?.data || error.message);
      setErrorMessage(error.response?.data?.message || 'Error updating profile');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  return (
    showProfileModal && user && (
      <div className="profile-modal-overlay">
        <div className="profile-modal">
          <img src={user.avatar} alt="User Avatar" className="profile-avatar" />
          <div className="profile-field">
            <span>Username:</span>
            {editField === 'username' ? (
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
            ) : (
              user.username
            )}
            <button onClick={() => setEditField(editField === 'username' ? null : 'username')}>
              {editField === 'username' ? 'Cancel' : 'Edit'}
            </button>
          </div>

          <div className="profile-field">
            <span>Email:</span>
            {editField === 'email' ? (
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            ) : (
              user.email || 'Not set'
            )}
            <button onClick={() => setEditField(editField === 'email' ? null : 'email')}>
              {editField === 'email' ? 'Cancel' : 'Edit'}
            </button>
          </div>

          <div className="profile-field">
            <span>Gender:</span>
            {editField === 'gender' ? (
              <select value={newGender} onChange={(e) => setNewGender(e.target.value)}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            ) : (
              user.gender
            )}
            <button onClick={() => setEditField(editField === 'gender' ? null : 'gender')}>
              {editField === 'gender' ? 'Cancel' : 'Edit'}
            </button>
          </div>

          <div className="profile-field">
            <span>Avatar:</span>
            {editField === 'avatar' ? (
              <input type="file" accept="image/*" onChange={(e) => setNewAvatar(e.target.files[0])} />
            ) : (
              <img src={user.avatar} alt="Avatar Preview" className="avatar-preview" />
            )}
            <button onClick={() => setEditField(editField === 'avatar' ? null : 'avatar')}>
              {editField === 'avatar' ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {editField && (
            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password to confirm"
                className="profile-password-input"
              />
              <span
                className="password-toggle-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️‍🗨️' : '👁️'}
              </span>
            </div>
          )}
          
          {errorMessage && <div className="error-message">{errorMessage}</div>}
           
          <div className="profile-modal-buttons">
            {editField && (
              <button className="save-btn" onClick={handleProfileUpdate}>
                Save
              </button>
            )}
            <button
              className="close-btn"
              onClick={() => {
                setShowProfileModal(false);
                setEditField(null);
                setPassword('');
                setNewAvatar(null);
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default ProfileModal;
