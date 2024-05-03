import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase'; 
import '../styles/ContentPage.css'; 

// Functional component to display the most recently uploaded file and navigation buttons
const ContentPage = () => {
  const [fileURL, setFileURL] = useState(''); // State to store the URL of the latest file
  const [fileName, setFileName] = useState(''); // State to store the name of the latest file
  const [fileType, setFileType] = useState(''); // State to store the type of the latest file

  // Fetch the most recent file from Firestore on component mount
  useEffect(() => {
    const filesRef = collection(db, "files"); // Reference to the 'files' collection in Firestore
    const q = query(filesRef, orderBy("timestamp", "desc"), limit(1)); // Query to get the latest file

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const files = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Mapping Firestore document data
      if (files.length > 0) {
        // Update state with details of the latest file
        setFileURL(files[0].downloadURL);
        setFileName(files[0].fileName);
        setFileType(files[0].fileType);
      }
    });

    return () => unsubscribe(); // Unsubscribe from Firestore listener on component unmount
  }, []);

  return (
    <div className="content-container">
      <div className="button-container">
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
        {fileType.startsWith('image/') && (
          <img src={fileURL} alt={`Preview of ${fileName}`} className="preview-image" /> // Display image file preview
        )}
        {fileType === 'application/pdf' && (
          <iframe src={fileURL} title={`Preview of ${fileName}`} className="preview-pdf" style={{ width: '100%', height: '100%' }}></iframe> // Display PDF file preview
        )}
        {fileType.startsWith('video/') && (
          <video controls className="video-container">
            <source src={fileURL} type={fileType} />
            Your browser does not support the video tag. // Fallback text for unsupported browsers
          </video>
        )}
        {!(fileType.startsWith('image/') || fileType === 'application/pdf' || fileType.startsWith('video/')) && (
          <p>No preview available</p> // Message displayed if no file preview is available
        )}
      </div>
    </div>
  );
};

export default ContentPage; 
