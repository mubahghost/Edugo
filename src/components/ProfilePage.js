import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import '../styles/ProfilePage.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 

// ProfilePage component to manage and display user profile information
const ProfilePage = () => {
  // State hooks for storing user profile data and image URL
  const [userProfile, setUserProfile] = useState({
    email: '',
    phone: '',
    school: '',
  });
  const [profileImageUrl, setProfileImageUrl] = useState('default_profile_picture.png');
  const [loading, setLoading] = useState(true);  // State for tracking data loading status
  const [editing, setEditing] = useState(false); // State for managing edit mode

  // Firebase services initialized
  const auth = getAuth();  // Authentication service
  const firestore = getFirestore();  // Firestore database service
  const storage = getStorage();  // Storage service for files

  // Effect hook to fetch user data from Firestore and manage authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // If user is authenticated, fetch their document from Firestore
        const userRef = doc(firestore, 'users', user.uid);
        getDoc(userRef).then((docSnapshot) => {
          if (docSnapshot.exists()) {
            // Extract and set user profile data from the document
            const { email, phone, school, fileOwner } = docSnapshot.data();
            setUserProfile({ email, phone, school });
            if (fileOwner) {
              // If there is a fileOwner field, fetch the profile image URL
              const imageRef = ref(storage, `profile_images/${fileOwner}`);
              getDownloadURL(imageRef).then(setProfileImageUrl).catch(console.error);
            } else {
              setProfileImageUrl('default_profile_picture.png');  // Set to default if no fileOwner is specified
            }
          }
        }).catch(console.error).finally(() => setLoading(false));  // Set loading to false after operations
      }
    });

    return () => unsubscribe();  // Clean up by unsubscribing on component unmount
  }, [auth, firestore, storage]);

  // Handler for changing the profile picture
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file && auth.currentUser) {
      const fileRef = ref(storage, `profile_images/${auth.currentUser.uid}`);
      setLoading(true);
      try {
        // Upload the file to Firebase Storage
        await uploadBytes(fileRef, file);
        const imageUrl = await getDownloadURL(fileRef);
        setProfileImageUrl(imageUrl);  // Update profile image URL state
        // Update Firestore document to indicate ownership of the new file
        await updateDoc(doc(firestore, 'users', auth.currentUser.uid), { fileOwner: auth.currentUser.uid });
        alert('Profile picture updated successfully.');
      } catch (error) {
        console.error('Error uploading new profile picture:', error);
        alert('Failed to upload new profile picture.');
      } finally {
        setLoading(false);  // Ensure loading state is reset
      }
    }
  };

  // Handler to enable editing of profile fields
  const handleEdit = () => {
    setEditing(true);
  };

  // Handler to save edited profile data back to Firestore
  const handleSave = async () => {
    setLoading(true);
    try {
      await updateDoc(doc(firestore, 'users', auth.currentUser.uid), {
        email: userProfile.email,
        phone: userProfile.phone,
        school: userProfile.school,
      });
      setEditing(false);  // Disable editing mode after save
      alert('Profile updated successfully.');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    } finally {
      setLoading(false);  // Reset loading state
    }
  };

  // Handler to manage changes to input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserProfile(prev => ({ ...prev, [name]: value }));  // Update corresponding field in userProfile state
  };

  // Conditional rendering based on the loading state
  if (loading) {
    return <div>Loading...</div>;  // Display loading message while data is being fetched or updated
  }

  // Render user profile interface
  return (
    <div className="container emp-profile">
      <div className="profile-img-container " style={{marginRight:"5%"}}>
        <img src={profileImageUrl} alt="Profile" className="profile-img"/>
        {editing && (
          <>
            <input type="file" accept="image/*" onChange={handleFileChange} id="file-input" style={{ display: 'none' }} />
            <label htmlFor="file-input" className="btn btn-secondary">Change Photo</label>
          </>
        )}
      </div>
      <div className="text text-white">
        {editing ? (
          <>
            <input type="email" name="email" value={userProfile.email} onChange={handleChange} />
            <input type="text" name="phone" value={userProfile.phone} onChange={handleChange} />
            <input type="text" name="school" value={userProfile.school} onChange={handleChange} />
            <button onClick={handleSave} className="btn btn-primary">Save</button>
          </>
        ) : (
          <>
            <p>Email: {userProfile.email}</p>
            <p>Phone: {userProfile.phone}</p>
            <p>School: {userProfile.school}</p>
            <button onClick={handleEdit} className="btn btn-secondary">Edit</button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
