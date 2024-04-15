import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import { db } from '../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import "../styles/Subjects.css";
import "../styles/subjectCardcustom.css"
const SubjectsAdmin = () => {
  const [subjects, setSubjects] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchSubjects = async () => {
      const subjectsCollectionRef = collection(db, 'subjects');
      const subjectsSnapshot = await getDocs(subjectsCollectionRef);
      const subjectsList = subjectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSubjects(subjectsList);
    };

    fetchSubjects();
  }, []);

  const handleRemoveSubject = async (subjectId) => {
    await deleteDoc(doc(db, 'subjects', subjectId));
    setSubjects(subjects.filter(subject => subject.id !== subjectId));
  };

  return (
    <>
      <Container className="mt-4">
        <Row xs={1} md={2} lg={3} className="g-4">
          {subjects.map((subject) => (
            <Col key={subject.id} className="pb-3">
              <div className="card card-custom bg-white border-white border-0">
                <div className="card-custom-img" style={{ backgroundImage: `url(${subject.icon || 'default_image_url_here'})` }}></div>
                <div className="card-custom-avatar">
                  <img className="img-fluid" src={subject.icon || 'default_avatar_url_here'} alt="Avatar" />
                </div>
                <div className="card-body" style={{ overflowY: 'auto' }}>
                  <h4 className="card-title">{subject.title}</h4>
                  <p className="card-text">{subject.summary}</p>
                </div>
                <div className="card-footer" style={{ background: 'inherit', borderColor: 'inherit' }}>
                  <Button variant="primary" onClick={() => console.log('Navigate', subject.id)}>Go to Subject</Button>
                  <Button variant="danger" onClick={() => handleRemoveSubject(subject.id)}>Delete</Button>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default SubjectsAdmin;
