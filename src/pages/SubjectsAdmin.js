// Import React hooks and necessary components
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import { db, storage } from '../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import "../styles/Subjects.css";
import "../styles/subjectCardcustom.css";

// Define the SubjectsAdmin component
const SubjectsAdmin = () => {
  // State hooks for managing subjects, modal visibility, form inputs, and uploading status
  const [subjects, setSubjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newSubjectTitle, setNewSubjectTitle] = useState('');
  const [newSubjectSummary, setNewSubjectSummary] = useState('');
  const [newSubjectImage, setNewSubjectImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Effect hook to fetch existing subjects from Firestore on component mount
  useEffect(() => {
    const fetchSubjects = async () => {
      const subjectsCollectionRef = collection(db, 'subjects');
      const subjectsSnapshot = await getDocs(subjectsCollectionRef);
      const subjectsList = subjectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSubjects(subjectsList);
    };

    fetchSubjects();
  }, []);

  // Handle image file selection
  const handleImageChange = (e) => {
    setNewSubjectImage(e.target.files[0]);
  };

  // Upload the selected image to Firebase Storage and return the URL
  const uploadImage = async () => {
    if (!newSubjectImage) return '';
    const fileRef = ref(storage, `subject-icons/${newSubjectImage.name}`);
    const snapshot = await uploadBytes(fileRef, newSubjectImage);
    const imageUrl = await getDownloadURL(snapshot.ref);
    return imageUrl;
  };

  // Handle adding a new subject including uploading the image
  const handleAddSubject = async () => {
    setUploading(true);
    const iconUrl = await uploadImage();
    const newSubject = {
      title: newSubjectTitle,
      summary: newSubjectSummary,
      icon: iconUrl
    };

    try {
      const docRef = await addDoc(collection(db, 'subjects'), newSubject);
      setSubjects([...subjects, { ...newSubject, id: docRef.id }]);
      resetForm();
    } catch (error) {
      console.error("Error adding subject:", error);
    } finally {
      setUploading(false);
      setShowModal(false);
    }
  };

  // Handle removing a subject
  const handleRemoveSubject = async (subjectId) => {
    try {
      await deleteDoc(doc(db, 'subjects', subjectId));
      setSubjects(subjects.filter(subject => subject.id !== subjectId));
    } catch (error) {
      console.error("Error removing subject:", error);
    }
  };

  // Reset form fields after adding a subject
  const resetForm = () => {
    setNewSubjectTitle('');
    setNewSubjectSummary('');
    setNewSubjectImage(null);
  };

  // Component rendering logic
  return (
    <>
      <div className="d-flex justify-content-center mt-4">
        <Button variant="primary" onClick={() => setShowModal(true)}>Add Subject</Button>
      </div>
      <Container className="mt-4">
        <Row xs={1} md={2} lg={3} className="g-4">
          {subjects.map((subject) => (
            <Col key={subject.id}>
              <div className="card">
                <div className="card-custom-img" style={{ backgroundImage: `url(${subject.icon || 'default_image_url_here'})` }}></div>
                <div className="card-body">
                  <h4 className="card-title">{subject.title}</h4>
                  <p className="card-text">{subject.summary}</p>
                </div>
                <div className="card-footer">
                  <Button variant="danger" onClick={() => handleRemoveSubject(subject.id)}>Delete</Button>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add a New Subject</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="subjectTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" placeholder="Enter subject title" value={newSubjectTitle} onChange={(e) => setNewSubjectTitle(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="subjectSummary">
              <Form.Label>Summary</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="Enter subject summary" value={newSubjectSummary} onChange={(e) => setNewSubjectSummary(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="subjectIcon">
              <Form.Label>Subject Icon</Form.Label>
              <Form.Control type="file" onChange={handleImageChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" disabled={uploading} onClick={handleAddSubject}>
            {uploading ? 'Uploading...' : 'Save New Subject'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SubjectsAdmin;
