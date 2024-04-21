import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { collection, query, orderBy, limit, onSnapshot, doc, setDoc, getFirestore } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../firebase';
import '../styles/ContentPage.css'; // Make sure this path is correct

const ContentPage = () => {
  const [fileURL, setFileURL] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const filesRef = collection(db, "files");
    const q = query(filesRef, orderBy("timestamp", "desc"), limit(1));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const files = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (files.length > 0) {
        setFileURL(files[0].downloadURL);
        setFileName(files[0].fileName);
        setFileType(files[0].fileType);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('No file selected for upload');
      return;
    }

    const storageRef = ref(getStorage(), `uploads/${selectedFile.name}`);
    const uploadTask = await uploadBytes(storageRef, selectedFile);
    const downloadURL = await getDownloadURL(uploadTask.ref);

    const fileData = {
      downloadURL,
      fileName: selectedFile.name,
      fileType: selectedFile.type,
      timestamp: new Date()
    };

    // Set or update the document in Firestore
    await setDoc(doc(db, "files", selectedFile.name), fileData);

    setFileURL(downloadURL);
    setFileName(selectedFile.name);
    setFileType(selectedFile.type);
    setEditMode(false); // Exit edit mode after upload

    alert('File uploaded successfully!');
  };

  return (
    <div className="content-container">
      <div className="button-container">
        <Link to="/Quiz" className="content-link">
          <Button className="content-btn">Take Quiz</Button>
        </Link>
        <Link to="/ProfilePage" className="content-link">
          <Button className="content-btn">View Profile</Button>
        </Link>
        <Link to="/ChatPage" className="content-link">
          <Button className="content-btn">Chat</Button>
        </Link>
        {editMode ? (
          <>
            <input type="file" onChange={handleFileSelect} />
            <Button onClick={handleUpload}>Upload File</Button>
            <Button onClick={() => setEditMode(false)}>Cancel Edit</Button>
          </>
        ) : (
          <Button onClick={() => setEditMode(true)} className="content-btn">Edit Content</Button>
        )}
      </div>
      <div className="file-preview">
        {fileType.startsWith('image/') && (
          <img src={fileURL} alt={`Preview of ${fileName}`} className="preview-image" />
        )}
        {fileType === 'application/pdf' && (
          <iframe src={fileURL} title={`Preview of ${fileName}`} className="preview-pdf" style={{ height: '500px' }}></iframe>
        )}
        {fileType.startsWith('video/') && (
          <video controls className="preview-video" style={{ width: '100%' }}>
            <source src={fileURL} type={fileType} />
            Your browser does not support the video tag.
          </video>
        )}
        {!(fileType.startsWith('image/') || fileType === 'application/pdf' || fileType.startsWith('video/')) && (
          <p>No preview available</p>
        )}
      </div>
    </div>
  );
};

export default ContentPage;
