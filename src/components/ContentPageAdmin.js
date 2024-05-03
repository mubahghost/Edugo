import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { storage, db, auth } from '../firebase';
import "../styles/SubjectCard.css";

const ContentPageAdmin = () => {
  const [showModal, setShowModal] = useState(false); // State to control visibility of modal
  const [file, setFile] = useState(null); // State to store the currently selected file
  const [fileURL, setFileURL] = useState(''); // State to store URL for file preview
  const [fileName, setFileName] = useState(''); // State to store name of the file
  const [fileType, setFileType] = useState(''); // State to store type of the file
  const [user, setUser] = useState(null); // State to store authenticated user details
  const navigate = useNavigate(); // Hook for programmatically navigating

  // Hook to manage authentication state and fetch latest file from Firestore
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => setUser(user || null)); // Listen for auth changes

    const filesRef = collection(db, "files");
    const q = query(filesRef, orderBy("timestamp", "desc"), limit(1));

    const unsubscribeFiles = onSnapshot(q, (snapshot) => {
      const files = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (files.length > 0) {
        setFileURL(files[0].downloadURL);
        setFileName(files[0].fileName);
        setFileType(files[0].fileType);
      }
    });

    return () => {
      unsubscribeAuth(); // Cleanup auth listener on unmount
      unsubscribeFiles(); // Cleanup files listener on unmount
    };
  }, []);

  const handleEditContent = () => setShowModal(true); // Handler to open modal
  const handleCloseModal = () => { // Handler to close modal and clear file state
    setShowModal(false);
    setFile(null);
  };

  const handleFileChange = (e) => { // Handler for file input change
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setFileType(selectedFile.type);
      const reader = new FileReader();
      reader.onloadend = () => setFileURL(reader.result); // Set URL for preview
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => { // Handler for uploading file to Firebase storage and database
    if (!user) {
      alert("You must be logged in to upload files.");
      return;
    }
    if (!file) {
      alert("Please select a file before uploading.");
      return;
    }
    const storageRef = ref(storage, `files/${user.uid}/${file.name}`);
    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      await addDoc(collection(db, "files"), {
        userId: user.uid,
        fileName: file.name,
        downloadURL: downloadURL,
        fileType: file.type,
        timestamp: new Date()
      });
      console.log("File uploaded successfully");
      setShowModal(false);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Please try again.");
    }
  };

  const goToChatPage = () => navigate('/ChatPage'); // Navigation handler to ChatPage

  return (
    <div className="content-container">
      <Button variant="primary" onClick={handleEditContent} style={{ display: 'block', margin: 'auto' }}>
        Edit Content
      </Button>
      <Button variant="success" onClick={goToChatPage} style={{ margin: '20px auto', display: 'block' }}>
        Go to Chat
      </Button>

      <div className="file-preview">
        {fileType.startsWith('image/') && (
          <img src={fileURL} alt={`Preview of ${fileName}`} style={{ width: '100%', height: 'auto' }} />
        )}
        {fileType === 'application/pdf' && (
          <iframe src={fileURL} title={`Preview of ${fileName}`} width="100%" height="600px"></iframe>
        )}
        {fileType.startsWith('video/') && (
          <video controls width="100%">
            <source src={fileURL} type={fileType} />
            Your browser does not support the video tag.

          </video>
        )}
        {!(fileType.startsWith('image/') || fileType === 'application/pdf' || fileType.startsWith('video/')) && (
          <>
            <p>{`File: ${fileName}`}</p>
            <Button variant="link" href={fileURL} download={fileName}>
              Click to download
            </Button>
          </>
        )}
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Content</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="file" accept="image/*,video/*,.pdf" onChange={handleFileChange} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
          <Button variant="primary" onClick={handleUpload}>Upload</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ContentPageAdmin;
