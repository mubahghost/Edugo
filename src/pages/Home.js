import React, { useState } from 'react';
import { Container, Row, Col, Button, Carousel, Modal, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../styles/Home.css";

import studyImage from '../assets/study.png';
import graduationImage from '../assets/graduation.png';
import successImage from '../assets/success.png';
import mathImage from '../assets/Maths.jpg';
import englishImage from '../assets/Eng.jpg';
import scienceImage from '../assets/Sci.jpg';

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleLearnMore = () => {
    if (!isLoggedIn) {
      alert("Login or register to view more.");  // This will display an alert if the user is not logged in
      setShowModal(false);  // Optionally close the modal if it's open
    } else {
      // If logged in, direct the user to another page or perform another action
      window.location.href = "/Courses";
    }
  };

  return (
    <>
      <Container>
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
            <Button variant="primary" onClick={handleShow} >Explore Courses</Button>
            <Link to="/Login"><Button variant="primary">Login/Signup</Button></Link>
            <Link to="/GettingStarted"><Button variant="primary">Getting Started</Button></Link>
          </Col>
        </Row>
      </Container>

      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Explore Courses</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row >
            <Col md={4}>
              <Card className="w-100">
                <Card.Img variant="top" src={mathImage} className="card-img-top" />
                <Card.Body>
                  <Card.Title>Math</Card.Title>
                  <Card.Text>Delve into the world of mathematics and discover the beauty and logic of numbers.</Card.Text>
                  <Button variant="primary" onClick={handleLearnMore}>Learn More</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} >
              <Card className="w-100">
                <Card.Img variant="top" src={englishImage} className="card-img-top" />
                <Card.Body>
                  <Card.Title>English</Card.Title>
                  <Card.Text>Enhance your language skills, explore classic literature, and improve your communication.</Card.Text>
                  <Button variant="primary" onClick={handleLearnMore}>Learn More</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} >
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
