import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import '../styles/ProfilePage.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is imported

const ProfilePage = () => {
  const [userProfile, setUserProfile] = useState({
    email: '',
    phone: '',
    school: '',
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
            const { email, phone, school, fileOwner } = docSnapshot.data();
            setUserProfile({ email, phone, school });
            if (fileOwner) {
              const imageRef = ref(storage, `profile_images/${fileOwner}`);
              getDownloadURL(imageRef).then(setProfileImageUrl).catch(console.error);
            } else {
              setProfileImageUrl('default_profile_picture.png');
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
    setLoading(true);
    try {
      await updateDoc(doc(firestore, 'users', auth.currentUser.uid), {
        email: userProfile.email,
        phone: userProfile.phone,
        school: userProfile.school,
      });
      setEditing(false);
      alert('Profile updated successfully.');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserProfile(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container emp-profile">
      <div className="profile-img-container">
        <img src={profileImageUrl} alt="Profile" className="profile-img"/>
        {editing && (
          <>
            <input type="file" accept="image/*" onChange={handleFileChange} id="file-input" style={{ display: 'none' }} />
            <label htmlFor="file-input" className="btn btn-secondary btn-sm mt-2">Change Photo</label>
          </>
        )}
      </div>
      <div className="text text-white">
        {editing ? (
          <>
            <input type="email" name="email" value={userProfile.email} onChange={handleChange} className="form-control mb-2"/>
            <input type="text" name="phone" value={userProfile.phone} onChange={handleChange} className="form-control mb-2"/>
            <input type="text" name="school" value={userProfile.school} onChange={handleChange} className="form-control mb-2"/>
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
