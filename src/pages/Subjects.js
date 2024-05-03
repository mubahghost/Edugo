import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import SubjectCard from '../components/subjectCard';
import "../styles/Subjects.css"; 

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);

  // Fetch subjects from Firestore database on component mount
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'subjects'), (snapshot) => {
      const updatedSubjects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSubjects(updatedSubjects);
    });

    // Cleanup function to unsubscribe from Firestore snapshot listener
    return () => unsubscribe();
  }, []);

  // Render subject cards with links to their respective pages
  return (
    <div className="page-container"> 
      <div className="subjects-container">
        {subjects.map(subject => (
          <Link to={subject.link} key={subject.id} className="subject-link">
            <SubjectCard
              title={subject.title}
              summary={subject.summary}
              icon={subject.icon}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Subjects;
