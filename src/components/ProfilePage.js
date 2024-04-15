import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { firestore, storage } from '../firebase';
import '../styles/ProfilePage.css';

const ProfilePage = ({ user }) => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
    profilePicUrl: '',
    quizResults: [],
    institute: '',
    role: '',
  });
  const [loading, setLoading] = useState(true);
  const [profilePic, setProfilePic] = useState(null);
  const [error, setError] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        setLoading(true);
        try {
          const userRef = firestore.collection('users').doc(user.uid);
          const doc = await userRef.get();
          if (doc.exists) {
            setUserData(doc.data());
          } else {
            console.log('No such document for user:', user.uid);
          }
        } catch (error) {
          console.error('Error getting document:', error);
          setError('Failed to fetch user data.');
        }
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleSaveClick = async () => {
    setError(null);
    try {
      const userRef = firestore.collection('users').doc(user.uid);
      await userRef.update(userData);
      alert('User data updated successfully.');
    } catch (error) {
      console.error('Error updating user data:', error);
      setError('Error updating user data.');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);

      // Validate file size and type here

      // Preview the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    setError(null);
    if (profilePic) {
      // Optimize the image here if necessary

      const storageRef = storage.ref();
      const fileRef = storageRef.child(`profile_pics/${user.uid}/${profilePic.name}`);
      try {
        await fileRef.put(profilePic);
        const imageUrl = await fileRef.getDownloadURL();
        setUserData({ ...userData, profilePicUrl: imageUrl });
        alert('Profile picture updated successfully.');
      } catch (error) {
        console.error('Error uploading image:', error);
        setError('Error uploading profile picture.');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  return (
    <Container>
      {error && <Alert variant="danger">{error}</Alert>}
      <div className="profile-container">
        <div className="profile-details">
          <div className="profile-pic-container">
            <img src={imagePreviewUrl || userData.profilePicUrl || 'default_profile_pic.png'} alt="Profile" className="profile-pic" />
            <input type="file" onChange={handleImageChange} />
            <Button variant="primary" onClick={handleImageUpload}>Upload Profile Picture</Button>
          </div>
          <h2>{userData.firstName} {userData.lastName}</h2>
          <p>Email: {userData.email}</p>
          <Form.Control
            as="textarea"
            rows={3}
            name="bio"
            placeholder="Bio"
            value={userData.bio}
            onChange={handleChange}
          />
          <Button variant="primary" onClick={handleSaveClick}>
            Save Changes
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default ProfilePage;
