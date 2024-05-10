import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import '../styles/quiz.css';

// Manages the quiz interactions, including question navigation, answer selection, and score calculation
const Quiz = () => {
  const navigate = useNavigate(); // Used for redirecting to other pages
  const [questions] = useState([
    { // Static data for quiz questions and answers
      questionText: 'What is 5+3?',
      answerOptions: [
        { answerText: '8', isCorrect: true },
        { answerText: '9', isCorrect: false },
        { answerText: '7', isCorrect: false },
        { answerText: '6', isCorrect: false },
      ],
    },
    { 
      questionText: 'What is 6x6?',
      answerOptions: [
        { answerText: '36', isCorrect: true },
        { answerText: '9', isCorrect: false },
        { answerText: '7', isCorrect: false },
        { answerText: '6', isCorrect: false },
      ],
    },
    { 
      questionText: 'What is 5x5?',
      answerOptions: [
        { answerText: '9', isCorrect: false },
        { answerText: '25', isCorrect: true },
        { answerText: '7', isCorrect: false },
        { answerText: '6', isCorrect: false },
      ],
    },
    { 
      questionText: 'What is 5+6?',
      answerOptions: [
        { answerText: '11', isCorrect: true },
        { answerText: '9', isCorrect: false },
        { answerText: '7', isCorrect: false },
        { answerText: '6', isCorrect: false },
      ],
    },
    { 
      questionText: 'What is 8+2?',
      answerOptions: [
        { answerText: '9', isCorrect: false },
        { answerText: '7', isCorrect: false },
        { answerText: '6', isCorrect: false },
        { answerText: '10', isCorrect: true },

      ],
    },
    { 
      questionText: 'What is 10+10?',
      answerOptions: [
        { answerText: '9', isCorrect: false },
        { answerText: '7', isCorrect: false },
        { answerText: '20', isCorrect: true },
        { answerText: '6', isCorrect: false },
      ],
    },
    { 
      questionText: 'What is 6-3?',
      answerOptions: [
        { answerText: '3', isCorrect: true },
        { answerText: '9', isCorrect: false },
        { answerText: '7', isCorrect: false },
        { answerText: '6', isCorrect: false },
      ],
    },
    { 
      questionText: 'What is 5+5?',
      answerOptions: [
        { answerText: '10', isCorrect: true },
        { answerText: '9', isCorrect: false },
        { answerText: '7', isCorrect: false },
        { answerText: '6', isCorrect: false },
      ],
    },
  ]);
  const [currentQuestion, setCurrentQuestion] = useState(0); // Tracks the number of the current question
  const [answers, setAnswers] = useState(Array(questions.length).fill(null)); // Records user's answers
  const [showScore, setShowScore] = useState(false); // Controls display of the score summary
  const [score, setScore] = useState(0); // gives user's score

  // Handles logic for selecting an answer, updating the score, and navigating through the quiz
  const handleAnswerClick = async (index) => {
    if (answers[currentQuestion] === null) {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = index;
      setAnswers(newAnswers);

      if (questions[currentQuestion].answerOptions[index].isCorrect) {
        setScore(prevScore => prevScore + 1);
      }

      // Move to the next question or finish the quiz
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
      } else {
        setShowScore(true);
        await handleSubmitQuiz(score + 1);
      }
    }
  };

  // Submits the final quiz score to the database when the quiz ends
  useEffect(() => {
    if (showScore) {
      handleSubmitQuiz(score + 1); 
    }
  }, [showScore]);

  // Saves quiz results in Firebase Firestore, handling updates for repeat attempts or new submissions
  const handleSubmitQuiz = async (quizScore) => {
    if (auth.currentUser) {
      const quizResultData = {
        userEmail: auth.currentUser.email,
        score: quizScore - 1,
        totalQuestions: questions.length,
        timestamp: new Date(),
      };
      const resultRef = doc(db, "quizResults", auth.currentUser.uid);
      try {
        const docSnap = await getDoc(resultRef);
        if (docSnap.exists()) {
          await updateDoc(resultRef, quizResultData);
          console.log("Quiz result updated successfully");
        } else {
          await setDoc(resultRef, quizResultData);
          console.log("Quiz result stored successfully");
        }
      } catch (error) {
        console.error("Error submitting quiz result:", error.message);
      }
    } else {
      alert("No user authenticated");
    }
  };

  // Navigates back to the content page upon completion
  const handleBackToContent = () => {
    navigate('/ContentPage');
  };

  // Render the quiz UI, including question navigation and score display
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
