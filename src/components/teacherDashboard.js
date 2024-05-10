import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from '../firebase';
import "../styles/TeacherDashboard.css";

function TeacherDashboard() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // Fetch all students
        const studentsQuery = query(collection(firestore, "users"), where("role", "==", "student"));
        const studentsSnapshot = await getDocs(studentsQuery);

        // scan over each student to fetch their quiz results
        const studentsData = await Promise.all(studentsSnapshot.docs.map(async (studentDoc) => {
          const studentData = studentDoc.data();
          
          // Fetch quiz results for this student based on their email
          const quizResultsQuery = query(collection(firestore, "quizResults"), where("userEmail", "==", studentData.email));
          const quizResultsSnapshot = await getDocs(quizResultsQuery);
          
          //quiz results stored to student object
          const quizResults = quizResultsSnapshot.docs.map(quizDoc => {
            const quizData = quizDoc.data();
            console.log("Quiz Data:", quizData);
            return { score: quizData.score, ...quizData };
          });

          console.log("Student Data:", studentData);
          console.log("Quiz Results:", quizResults);

          return {
            ...studentData,
            id: studentDoc.id,
            quizResults // Add quizResults including the score to the student object
          };
        }));

        console.log("Students Data:", studentsData);
        setStudents(studentsData);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  return (
    <>
      <h1>Teacher Dashboard</h1>
      <div className="dashboard-container">
        <h2>Student List</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Quiz Results</th> {/* Updated to display quiz results */}
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.role}</td>
                <td>
                  {student.quizResults.map((result, index) => (
                    <div key={index}>
                      Score: {result.score}
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
}

export default TeacherDashboard;
