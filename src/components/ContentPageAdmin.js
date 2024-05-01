import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { storage, db, auth } from '../firebase';
import "../styles/SubjectCard.css";


// ContentPageAdmin component for managing content uploads and updates
const ContentPageAdmin = () => {
  // State hooks to manage modal visibility, file selection, file details, and user authentication
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState('');
  const [fileName, setFileName] = useState('');
  const [user, setUser] = useState(null);
  const [fileType, setFileType] = useState('');

  // Effect hook to listen for changes in user authentication status and file updates
  useEffect(() => {
    // Subscribes to user authentication status
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setUser(user || null); // Sets user data or null if not authenticated
    });

    // Query to fetch the most recently uploaded file from Firestore
    const filesRef = collection(db, "files");
    const q = query(filesRef, orderBy("timestamp", "desc"), limit(1));

    // Subscribes to the latest file data in real-time
    const unsubscribeFiles = onSnapshot(q, (snapshot) => {
      const files = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Maps file data from Firestore
      if (files.length > 0) {
        // If there is at least one file, set the file details
        setFileURL(files[0].downloadURL);
        setFileName(files[0].fileName);
        setFileType(files[0].fileType);
      }
    });

    // Cleanup function to unsubscribe from listeners when the component unmounts
    return () => {
      unsubscribeAuth();
      unsubscribeFiles();
    };
  }, []);

  // Handler to show the modal for editing content
  const handleEditContent = () => setShowModal(true);
  // Handler to close the modal and reset the file selection
  const handleCloseModal = () => {
    setShowModal(false);
    setFile(null);
  };

  // Handler for file selection, updating the file state and preview URL
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile); // Sets the selected file
      setFileName(selectedFile.name); // Sets the file name
      setFileType(selectedFile.type); // Sets the file type
      const reader = new FileReader(); // Creates a FileReader to read the file data
      reader.onloadend = () => setFileURL(reader.result); // Sets the file URL upon loading the file
      reader.readAsDataURL(selectedFile); // Initiates the reading of the selected file
    }
  };

  // Handler to upload the selected file to Firebase Storage and store its details in Firestore
  const handleUpload = async () => {
    if (!user) {
      alert("You must be logged in to upload files.");
      return;
    }
    if (!file) {
      alert("Please select a file before uploading.");
      return;
    }
    const storageRef = ref(storage, `files/${user.uid}/${file.name}`); // Reference to storage path
    try {
      const snapshot = await uploadBytes(storageRef, file); // Uploads the file to Firebase Storage
      const downloadURL = await getDownloadURL(snapshot.ref); // Retrieves the download URL
      await addDoc(collection(db, "files"), {
        userId: user.uid,
        fileName: file.name,
        downloadURL: downloadURL,
        fileType: file.type,
        timestamp: new Date() // Sets the current date and time as the timestamp
      });
      console.log("File uploaded successfully");
      setShowModal(false); // Closes the modal upon successful upload
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Please try again.");
    }
  };

  // Render method to display the user interface
  return (
    <div className="content-container">
      <Button variant="primary" onClick={handleEditContent} style={{ display: 'block', margin: 'auto' }}>
        Edit Content
      </Button>

      <div className="file-preview">
        // Conditionally renders file previews based on the file type
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

      // Modal for editing content which includes a file input and upload button
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

export default ContentPageAdmin; // Exports the component for use in other parts of the application
