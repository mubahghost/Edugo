// Import necessary React hooks and other utilities
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // For navigation between components
import { collection, onSnapshot } from 'firebase/firestore'; // Firestore methods for real-time data
import { db } from '../firebase'; // Firebase configuration and instance
import SubjectCard from '../components/subjectCard'; // Reusable subject card component
import "../styles/Subjects.css";  // CSS for styling the subjects page

const Subjects = () => {
  // useState hook to store the list of subjects
  const [subjects, setSubjects] = useState([]);

  // useEffect hook to fetch subjects data from Firestore upon component mount
  useEffect(() => {
    // Subscribe to the 'subjects' collection in Firestore
    const unsubscribe = onSnapshot(collection(db, 'subjects'), (snapshot) => {
      // Map through each document and restructure the data
      const updatedSubjects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Update the subjects state with new data
      setSubjects(updatedSubjects);
    });

    // Clean up function to unsubscribe from the collection when the component unmounts
    return () => unsubscribe();
  }, []);

  // Render the component
  return (
    <div className="page-container">
      <div className="subjects-container">
        {/* Map over the subjects array and render a SubjectCard for each subject */}
        {subjects.map(subject => (
          // Wrap each SubjectCard in a Link to enable navigation based on the subject's link
          <Link to={subject.link} key={subject.id} className="subject-link">
            <SubjectCard
              title={subject.title}  // Pass title as a prop to SubjectCard
              summary={subject.summary}  // Pass summary as a prop to SubjectCard
              icon={subject.icon}  // Pass icon URL as a prop to SubjectCard
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Subjects; // Export the Subjects component for use in other parts of the application
