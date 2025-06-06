import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiUpload, FiTrash2, FiLogOut } from 'react-icons/fi';
import './Settings.css';

const Settings = () => {
  const [profile, setProfile] = useState({ username: '', email: '', profilePic: null });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const { data } = await axios.get('http://localhost:5000/api/admin/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(data);
    } catch (error) {
      console.error('Fetch profile error:', error.response ? error.response.data : error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const updateProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return alert('Not authenticated');
      await axios.put(
        'http://localhost:5000/api/admin/profile',
        { username: profile.username, email: profile.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Profile updated successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const uploadProfilePic = async () => {
    if (!selectedFile) return alert('Please select a file first');
    const formData = new FormData();
    formData.append('profilePic', selectedFile);

    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return alert('Not authenticated');
      const { data } = await axios.post('http://localhost:5000/api/admin/profile/picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setProfile((prev) => ({ ...prev, profilePic: data.profilePic }));
      setSelectedFile(null);
      alert('Profile picture uploaded');
    } catch (error) {
      alert(error.response?.data?.message || 'Upload failed');
    }
    setUploading(false);
  };

  const removeProfilePic = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return alert('Not authenticated');
      await axios.delete('http://localhost:5000/api/admin/profile/picture', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile((prev) => ({ ...prev, profilePic: null }));
      alert('Profile picture removed');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to remove profile picture');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>

      <section className="profile-section">
        <h3>Profile Information</h3>
        <div className="profile-pic-wrapper">
          {profile.profilePic ? (
            <>
              <img
                src={`http://localhost:5000/uploads/admin-profile-pics/${profile.profilePic}`}
                alt="Profile"
                className="profile-pic"
              />
              <button onClick={removeProfilePic} title="Remove Profile Picture">
                <FiTrash2 />
              </button>
            </>
          ) : (
            <div className="profile-placeholder">No Profile Picture</div>
          )}
        </div>

        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button onClick={uploadProfilePic} disabled={uploading}>
          {uploading ? 'Uploading...' : <><FiUpload /> Upload Picture</>}
        </button>

        <div className="profile-info-form">
          <label>Username</label>
          <input type="text" name="username" value={profile.username || ''} onChange={handleInputChange} />

          <label>Email</label>
          <input type="email" name="email" value={profile.email || ''} onChange={handleInputChange} />

          <button onClick={updateProfile}>Update Profile</button>
        </div>
      </section>

      <section className="logout-section" style={{ marginTop: '20px' }}>
        <button className="logout-btn" onClick={logout}>
          <FiLogOut /> Logout
        </button>
      </section>
    </div>
  );
};

export default Settings;
