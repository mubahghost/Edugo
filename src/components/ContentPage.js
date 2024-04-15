import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import '../styles/ContentPage.css'; // Adjust path as needed



const ContentPage = () => {
  const [fileURL, setFileURL] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('');

  useEffect(() => {
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
      unsubscribeFiles();
    };
  }, []);

  return (
    <div className="content-container">
      <div className="button-container">
        <Link to="/Quiz">
          <Button className="QuizBtn">Attempt quiz</Button>
        </Link>
        <Link to="/ProfilePage" className="viewPFbtnContentp">
          <Button className="viewProfileBtn">View Profile</Button>
        </Link>
      </div>
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
        {/* For other file types, provide a download link */}
        {!(fileType.startsWith('image/') || fileType === 'application/pdf' || fileType.startsWith('video/')) && (
          <>
            <p>{`File: ${fileName}`}</p>
            <Button variant="link" href={fileURL} download={fileName}>
              Click to download
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ContentPage;
