import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import '../styles/quiz.css';

// Quiz component to manage the quiz interface and functionality
const Quiz = () => {
  const navigate = useNavigate(); // Hook for programmatically navigating between routes
  // Static list of questions and answers
  const [questions] = useState([
    // Question data structure with question text and answer options
    {
      questionText: 'What is 5+3?',
      answerOptions: [
        { answerText: '8', isCorrect: true },
        { answerText: '9', isCorrect: false },
        { answerText: '7', isCorrect: false },
        { answerText: '6', isCorrect: false },
      ],
    },
    // More questions...
  ]);
  const [currentQuestion, setCurrentQuestion] = useState(0); // State to track the current question index
  const [answers, setAnswers] = useState(Array(questions.length).fill(null)); // State to store user answers
  const [showScore, setShowScore] = useState(false); // State to toggle the score display
  const [score, setScore] = useState(0); // State to track the user's score
  
  // Function to handle answer selection
  const handleAnswerClick = async (index) => {
    if (answers[currentQuestion] === null) { // Check if the question has not already been answered
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = index; // Record the user's answer
      setAnswers(newAnswers);

      // Update the score if the answer is correct
      if (questions[currentQuestion].answerOptions[index].isCorrect) {
        setScore(prevScore => prevScore + 1);
      }

      const nextQuestion = currentQuestion + 1;
      // Navigate to the next question or show the score if it's the last question
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
      } else {
        setShowScore(true);
        await handleSubmitQuiz(score + 1); // Submit the quiz results
      }
    }
  };

  // Effect hook to handle quiz submission when scoring is displayed
  useEffect(() => {
    if (showScore) {
      handleSubmitQuiz(score + 1);
    }
  }, [showScore]);

  // Function to handle quiz result submission
  const handleSubmitQuiz = async (quizScore) => {
    if (auth.currentUser) { // Check if the user is logged in
      const quizResultData = {
        userEmail: auth.currentUser.email, // User email
        score: quizScore - 1, // Adjust the score (remove an extra increment)
        totalQuestions: questions.length, // Total number of questions
        timestamp: new Date(), // Current timestamp
      };

      const resultRef = doc(db, "quizResults", auth.currentUser.uid); // Document reference for storing quiz results

      try {
        const docSnap = await getDoc(resultRef);
        if (docSnap.exists()) {
          await updateDoc(resultRef, quizResultData); // Update the existing document
          console.log("Quiz result updated successfully");
        } else {
          await setDoc(resultRef, quizResultData); // Create a new document if it doesn't exist
          console.log("Quiz result stored successfully");
        }
      } catch (error) {
        console.error("Error submitting quiz result: ", error.message); // Log any errors during submission
      }
    } else {
      alert("No user authenticated"); // Alert if no user is logged in
    }
  };

  // Function to navigate back to the content page
  const handleBackToContent = () => {
    navigate('/ContentPage');
  };

  // Render the quiz interface
  return (
    <Container className="quiz-container">
      <Row className="justify-content-md-center">
        <Col md={12}>
          <Card>
            <Card.Header as="h5">Maths QUIZ</Card.Header>
            {showScore ? (
              <Card.Body>
                <Card.Title>Quiz Completed! Your score: {score} out of {questions.length}</Card.Title>
                <Button variant="primary" onClick={handleBackToContent}>
                  Back to Contents Page
                </Button>
              </Card.Body>
            ) : (
              <>
                <Card.Body>
                  <Card.Title>Question {currentQuestion + 1}/{questions.length}</Card.Title>
                  <Card.Text>{questions[currentQuestion].questionText}</Card.Text>
                  <ListGroup variant="flush">
                    {questions[currentQuestion].answerOptions.map((answerOption, index) => (
                      <ListGroup.Item
                        key={index}
                        onClick={() => handleAnswerClick(index)}
                        disabled={answers[currentQuestion] !== null}
                        active={index === answers[currentQuestion]}
                      >
                        {answerOption.answerText}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
                <Card.Footer>
                  <Button variant="secondary" onClick={() => setCurrentQuestion(Math.max(currentQuestion - 1, 0))} disabled={currentQuestion === 0}>
                    Prev
                  </Button>
                  <Button variant="primary" onClick={() => setCurrentQuestion(Math.min(currentQuestion + 1, questions.length - 1))} disabled={currentQuestion === questions.length - 1}>
                    Next
                  </Button>
                </Card.Footer>
              </>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Quiz;
