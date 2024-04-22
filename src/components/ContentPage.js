import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import '../styles/ContentPage.css'; // Make sure this path is correct

const ContentPage = () => {
  const [fileURL, setFileURL] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('');

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
          <p>No preview available</p>
        )}
      </div>
    </div>
  );
};

export default ContentPage;
