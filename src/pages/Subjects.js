import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase'; // Assuming you have a Firebase configuration file
import SubjectCard from '../components/subjectCard'; // Import the SubjectCard component
import "../styles/SubjectCard.css";
import '../styles/Subjects.css'; // Adjust path as needed

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'subjects'), (snapshot) => {
      const updatedSubjects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSubjects(updatedSubjects);
    });

    return () => unsubscribe(); // Unsubscribe when the component unmounts
  }, []);

  return (
    <div className="subjects-container">
      <div className="subjects-grid">
        {subjects.map(subject => (
          <Link to={subject.link} key={subject.id} className="subject-link"> {/* Wrap with Link component */}
            <SubjectCard
              title={subject.title}
              summary={subject.summary}
              icon={subject.icon}
              className={subject.className}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Subjects;
