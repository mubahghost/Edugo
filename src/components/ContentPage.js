// Importing necessary React hooks, Bootstrap components, and router link
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase'; 
import '../styles/ContentPage.css'; 

// Functional component ContentPage to display the most recently uploaded file and navigation buttons
const ContentPage = () => {
  // State variables to store the URL, name, and type of the latest file
  const [fileURL, setFileURL] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('');

  // useEffect hook to fetch the most recent file from the Firebase Firestore when the component mounts
  useEffect(() => {
    const filesRef = collection(db, "files"); // Reference to the 'files' collection in Firestore
    const q = query(filesRef, orderBy("timestamp", "desc"), limit(1)); // Query to get the latest file based on timestamp

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const files = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Mapping document data to an array
      if (files.length > 0) {
        // If there are files, set the state with the first file's details
        setFileURL(files[0].downloadURL);
        setFileName(files[0].fileName);
        setFileType(files[0].fileType);
      }
    });

    return () => unsubscribe(); // Cleanup function to unsubscribe from Firestore listener when component unmounts
  }, []);

  // Render function to display the UI components of the ContentPage
  return (
    <div className="content-container">
      <div className="button-container">
        // Navigation buttons to various parts of the app using react-router-dom Links
        <Link to="/Quiz" className="content-link">
          <Button className="QuizBtn">Take Quiz</Button>
        </Link>
        <Link to="/ProfilePage" className="content-link">
          <Button className="viewPFbtnContentp">View Profile</Button>
        </Link>
        <Link to="/ChatPage" className="content-link">
          <Button className="content-btn">Chat</Button>
        </Link>
      </div>
      <div className="file-preview">
        // Conditional rendering based on the file type to display appropriate preview elements
        {fileType.startsWith('image/') && (
          <img src={fileURL} alt={`Preview of ${fileName}`} className="preview-image" />
        )}
        {fileType === 'application/pdf' && (
          <iframe src={fileURL} title={`Preview of ${fileName}`} className="preview-pdf" style={{ width: '100%', height: '100%' }}></iframe>
        )}
        {fileType.startsWith('video/') && (
          <video controls className="video-container">
            <source src={fileURL} type={fileType} />
            Your browser does not support the video tag.
          </video>
        )}
        {!(fileType.startsWith('image/') || fileType === 'application/pdf' || fileType.startsWith('video/')) && (
          <p>No preview available</p> // Display a message if no preview is available for the file type
        )}
      </div>
    </div>
  );
};

export default ContentPage; 