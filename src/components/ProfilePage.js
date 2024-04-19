import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import '../styles/ProfilePage.css'; 

const ProfilePage = () => {
  const [userProfile, setUserProfile] = useState({
    dob: '',
    email: '',
    fileOwner: '',
    name: '',
    phone: '',
    role: '',
    school: '',
    userID2: '',
  });
  const [profileImageUrl, setProfileImageUrl] = useState('default_profile_picture.png');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false); 

  const auth = getAuth();
  const firestore = getFirestore();
  const storage = getStorage();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userRef = doc(firestore, 'users', user.uid);
        getDoc(userRef).then((docSnapshot) => {
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            setUserProfile(userData);
            if (userData.fileOwner) {
              const imageRef = ref(storage, `profile_images/${userData.fileOwner}`);
              getDownloadURL(imageRef).then(setProfileImageUrl).catch(console.error);
            }
          }
        }).catch(console.error).finally(() => setLoading(false));
      }
    });
    return () => unsubscribe();
  }, [auth, firestore, storage]);

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
        alert('Failed to upload new profile picture.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateDoc(doc(firestore, 'users', auth.currentUser.uid), userProfile);
      setEditing(false);
      alert('Profile updated successfully.');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container emp-profile">
      <div className="image">
        <img src={profileImageUrl} alt={userProfile.name || 'Profile'} className="profile-img"/>
        {editing && (
          <div>
            <input type="file" name="file" onChange={handleFileChange} id="upload-button" style={{ display: 'none' }} />
            <label htmlFor="upload-button" className="profile-pic-container button">Change Photo</label>
          </div>
        )}
      </div>
      <div className="text">
        {editing ? (
          <>
            <input type="text" name="name" value={userProfile.name} onChange={handleChange} />
            <input type="text" name="role" value={userProfile.role} onChange={handleChange} />
            <input type="text" name="school" value={userProfile.school} onChange={handleChange} />
            <button onClick={handleSave}>Save</button>
          </>
        ) : (
          <>
            <h5 className="text1">Name: {userProfile.name}</h5>
            <h6 className="text1">Role: {userProfile.role}</h6>
            <p className="text1">SCHOOL: <span>{userProfile.school}</span></p>
            <button onClick={handleEdit}>Edit</button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
