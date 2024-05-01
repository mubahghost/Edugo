import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import SubjectCard from '../components/subjectCard';
import "../styles/Subjects.css"; 


const Subjects = () => {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'subjects'), (snapshot) => {
      const updatedSubjects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSubjects(updatedSubjects);
    });

    return () => unsubscribe();
  }, []);

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