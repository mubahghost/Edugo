import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { FiEdit } from 'react-icons/fi'; // Import Edit icon from react-icons
import { firestore } from '../firebase'; // Import Firebase firestore
import '../styles/ProfilePage.css';

const ProfilePage = ({ user }) => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    if (user) {
      const userRef = firestore.collection('users').doc(user.uid);
      userRef.get().then((doc) => {
        if (doc.exists) {
          setUserData(doc.data());
        } else {
          console.log('No such document for user:', user.uid);
        }
      }).catch((error) => {
        console.error('Error getting document:', error);
      }).finally(() => {
        setLoading(false); // Set loading to false when data fetching is complete
      });
    }
  }, [user]);

  // Add error handling for null user
  if (!user) {
    return <div>User not logged in.</div>;
  }

  // Add loading state check
  if (loading) {
    return <div>Loading...</div>;
  }

  // Add debug log for userData
  console.log('userData:', userData);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleSaveClick = async () => {
    try {
      const userRef = firestore.collection('users').doc(user.uid);
      await userRef.update(userData);
      setEditMode(false);
      console.log('User data updated:', userData);
    } catch (error) {
      console.error('Error updating user data:', error);
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
    <Container className="profile-view-container">
      <div className="profileview">
        <h1>{userData.firstName} {userData.lastName}</h1>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Bio:</strong> {userData.bio}</p>
        {!editMode ? (
          <Button variant="primary" onClick={handleEditClick}>
            Edit Profile <FiEdit />
          </Button>
        ) : (
          <>
            <Form.Group controlId="formBasicFirstName">
              <Form.Control
                type="text"
                name="firstName"
                value={userData.firstName}
                onChange={handleChange}
                placeholder="First Name"
              />
            </Form.Group>
            <Form.Group controlId="formBasicLastName">
              <Form.Control
                type="text"
                name="lastName"
                value={userData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Control
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                placeholder="Email"
              />
            </Form.Group>
            <Form.Group controlId="formBasicBio">
              <Form.Control
                as="textarea"
                rows={3}
                name="bio"
                value={userData.bio}
                onChange={handleChange}
                placeholder="Bio"
              />
            </Form.Group>
            <Button variant="success" onClick={handleSaveClick}>
              Save Changes
            </Button>
          </>
        )}
      </div>
    </Container>
  );
};

export default ProfilePage;
