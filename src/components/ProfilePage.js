import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import '../styles/ProfilePage.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 

// ProfilePage component for managing and displaying user profile information
const ProfilePage = () => {
  const [userProfile, setUserProfile] = useState({ email: '', phone: '', school: '' });
  const [profileImageUrl, setProfileImageUrl] = useState('default_profile_picture.png');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const auth = getAuth();
  const firestore = getFirestore();
  const storage = getStorage();

  // Fetches user data on authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userRef = doc(firestore, 'users', user.uid);
        getDoc(userRef).then((docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            setUserProfile({ email: data.email, phone: data.phone, school: data.school });
            if (data.fileOwner) {
              const imageRef = ref(storage, `profile_images/${data.fileOwner}`);
              getDownloadURL(imageRef).then(setProfileImageUrl).catch(console.error);
            }
          }
        }).catch(console.error).finally(() => setLoading(false));
      }
    });
    return () => unsubscribe();
  }, [auth, firestore, storage]);

  // Handles file selection for profile image update
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file && auth.currentUser) {
      const fileRef = ref(storage, `profile_images/${auth.currentUser.uid}`);
      setLoading(true);
      try {
        await uploadBytes(fileRef, file);
        const imageUrl = await getDownloadURL(fileRef);
        setProfileImageUrl(imageUrl);
        await updateDoc(doc(firestore, 'users', auth.currentUser.uid), { fileOwner: auth.currentUser.uid });
        alert('Profile picture updated successfully.');
      } catch (error) {
        console.error('Error uploading new profile picture:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Enables editing mode
  const handleEdit = () => setEditing(true);

  // Saves edited profile data
  const handleSave = async () => {
    setLoading(true);
    try {
      await updateDoc(doc(firestore, 'users', auth.currentUser.uid), userProfile);
      setEditing(false);
      alert('Profile updated successfully.');
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handles changes in form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserProfile(prev => ({ ...prev, [name]: value }));
  };

  // Conditional rendering based on the loading state
  if (loading) return <div>Loading...</div>;

  return (
    <div className="container emp-profile">
      <div className="profile-img-container" style={{ marginRight: "5%" }}>
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
