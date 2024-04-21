// Import Bootstrap CSS and other necessary libraries and styles
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { Container, Row, Col, Button, Carousel, Modal, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import "../styles/Home.css"; // Ensure the path to your CSS file is correct

// Images, make sure the path is correct based on where you've stored your images
import studyImage from '../assets/study.png';
import graduationImage from '../assets/graduation.png';
import successImage from '../assets/success.png';
import mathImage from '../assets/Maths.jpg';
import englishImage from '../assets/Eng.jpg';
import scienceImage from '../assets/Sci.jpg';

// HomePage Component
const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to handle the modal display
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  // Function to handle the action on Learn More button click
  const handleLearnMore = () => {
    if (!isLoggedIn) {
      setShowModal(true);
    } else {
      window.location.href = "/SignUp";
    }
  };

  return (
    <>
      {/* Your main page content */}
      <Container className="my-5 container-top-adjust">
        <Row className="align-items-center">
          <Col lg={5} className="order-lg-last">
            <Carousel>
              <Carousel.Item>
                <img className="d-block w-100" src={studyImage} alt="Study" />
              </Carousel.Item>
              <Carousel.Item>
                <img className="d-block w-100" src={graduationImage} alt="Graduation" />
              </Carousel.Item>
              <Carousel.Item>
                <img className="d-block w-100" src={successImage} alt="Success" />
              </Carousel.Item>
            </Carousel>
          </Col>
          <Col lg={7} className="text-lg-right">
            <h2>Welcome to EDUGO</h2>
            <p>Your journey to excellence in education begins here. Explore our courses and find the right path for your academic and personal growth.</p>
            <Button variant="primary" onClick={handleShow} className="mr-3">Explore Courses</Button>
            <Link to="/Login"><Button variant="primary">Login/Signup</Button></Link>
            <Link to="/GettingStarted"><Button variant="primary">Getting Started</Button></Link>
          </Col>
        </Row>
      </Container>

      {/* Modal for exploring courses */}
      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Explore Courses</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="gx-0 gy-4">
            <Col md={4} className="d-flex justify-content-center">
              <Card className="w-100">
                <Card.Img variant="top" src={mathImage} className="card-img-top" />
                <Card.Body>
                  <Card.Title>Math</Card.Title>
                  <Card.Text>Delve into the world of mathematics and discover the beauty and logic of numbers.</Card.Text>
                  <Button variant="primary" onClick={handleLearnMore}>Learn More</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="d-flex justify-content-center">
              <Card className="w-100">
                <Card.Img variant="top" src={englishImage} className="card-img-top" />
                <Card.Body>
                  <Card.Title>English</Card.Title>
                  <Card.Text>Enhance your language skills, explore classic literature, and improve your communication.</Card.Text>
                  <Button variant="primary" onClick={handleLearnMore}>Learn More</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="d-flex justify-content-center">
              <Card className="w-100">
                <Card.Img variant="top" src={scienceImage} className="card-img-top" />
                <Card.Body>
                  <Card.Title>Science</Card.Title>
                  <Card.Text>Unlock the mysteries of the universe with our science courses, from biology to physics.</Card.Text>
                  <Button variant="primary" onClick={handleLearnMore}>Learn More</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Modal.Body>
        {isLoggedIn ? null : (
          <Modal.Footer>
            <p>To learn more, please sign up.</p>
            <Link to="/SignUp">
              <Button variant="primary">Sign Up</Button>
            </Link>
          </Modal.Footer>
        )}
      </Modal>
    </>
  );
};

export default HomePage;
