
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SubjectCard from '../components/subjectCard'; // Ensure this matches the actual file name
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import '../styles/Subjects.css';
import mathsIcon from '../assets/Maths.jpg';
import englishIcon from '../assets/Eng.jpg';
import scienceIcon from '../assets/Sci.jpg';

const subjects = [
  { id: 1, title: "Mathematics", summary: "Explore the world of numbers and shapes.", details: "Detailed info about Mathematics", icon: mathsIcon, link: '/ContentPage', className: 'maths-card' },
  { id: 2, title: "Science", summary: "Unlock the mysteries of the universe.", details: "Detailed info about Science", icon: scienceIcon, link: '/ContentPage', className: 'science-card' },
  { id: 3, title: "English", summary: "Enhance your language skills.", details: "Detailed info about English", icon: englishIcon, link: '/ContentPage', className: 'english-card' },
];

const TestPage = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [selectedSubjectLink, setSelectedSubjectLink] = useState('');

  const handleShow = (subject) => {
    setModalContent(subject.details);
    setSelectedSubjectLink(subject.link);
    setShowModal(true);
  };

  const handleNavigate = () => {
    navigate(selectedSubjectLink);
  };

  const handleEdit = (subjectId) => {
    // Implement edit functionality
    console.log("Edit clicked for subject with ID:", subjectId);
  };

  const handleRemove = (subjectId) => {
    // Implement remove functionality
    console.log("Remove clicked for subject with ID:", subjectId);
  };

  return (
    <>
      <div className="header">
        <h2>Subjects</h2>
      </div>
      <div className="subjects-container">
        <Container>
          <Row xs={1} md={2} lg={3} className="g-4">
            {subjects.map((subject) => (
              <Col key={subject.id} onClick={() => handleShow(subject)}>
                <SubjectCard 
                  title={subject.title} 
                  summary={subject.summary} 
                  icon={subject.icon}
                  className={subject.className}
                  onEdit={() => handleEdit(subject.id)}
                  onRemove={() => handleRemove(subject.id)}
                />
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Subject Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalContent}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleNavigate}>Go to Content</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TestPage;
