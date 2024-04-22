import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import '../styles/quiz.css';

const Quiz = () => {
  const navigate = useNavigate();
  const [questions] = useState([
    {
      questionText: 'What is 5+3?',
      answerOptions: [
        { answerText: '8', isCorrect: true },
        { answerText: '9', isCorrect: false },
        { answerText: '7', isCorrect: false },
        { answerText: '6', isCorrect: false },
      ],
    },
    {
      questionText: 'What is 10-6?',
      answerOptions: [
        { answerText: '4', isCorrect: true },
        { answerText: '5', isCorrect: false },
        { answerText: '3', isCorrect: false },
        { answerText: '6', isCorrect: false },
      ],
    },
    {
      questionText: 'What is 2x4?',
      answerOptions: [
        { answerText: '8', isCorrect: true },
        { answerText: '6', isCorrect: false },
        { answerText: '10', isCorrect: false },
        { answerText: '9', isCorrect: false },
      ],
    },
    {
      questionText: 'What is 12 divided by 3?',
      answerOptions: [
        { answerText: '4', isCorrect: true },
        { answerText: '5', isCorrect: false },
        { answerText: '3', isCorrect: false },
        { answerText: '6', isCorrect: false },
      ],
    },
    {
      questionText: 'What is the sum of 7 and 2?',
      answerOptions: [
        { answerText: '9', isCorrect: true },
        { answerText: '8', isCorrect: false },
        { answerText: '10', isCorrect: false },
        { answerText: '11', isCorrect: false },
      ],
    },
    {
      questionText: 'What is half of 10?',
      answerOptions: [
        { answerText: '5', isCorrect: true },
        { answerText: '6', isCorrect: false },
        { answerText: '4', isCorrect: false },
        { answerText: '7', isCorrect: false },
      ],
    },
    {
      questionText: 'What is 20-4?',
      answerOptions: [
        { answerText: '16', isCorrect: true },
        { answerText: '15', isCorrect: false },
        { answerText: '18', isCorrect: false },
        { answerText: '14', isCorrect: false },
      ],
    },
    {
      questionText: 'What is 3x3?',
      answerOptions: [
        { answerText: '9', isCorrect: true },
        { answerText: '6', isCorrect: false },
        { answerText: '12', isCorrect: false },
        { answerText: '7', isCorrect: false },
      ],
    },
    {
      questionText: 'What is 15 divided by 5?',
      answerOptions: [
        { answerText: '3', isCorrect: true },
        { answerText: '4', isCorrect: false },
        { answerText: '2', isCorrect: false },
        { answerText: '6', isCorrect: false },
      ],
    },
    {
      questionText: 'What is 6+4?',
      answerOptions: [
        { answerText: '10', isCorrect: true },
        { answerText: '9', isCorrect: false },
        { answerText: '11', isCorrect: false },
        { answerText: '8', isCorrect: false },
      ],
    }
    
  ]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const handleAnswerClick = async (index) => {
    if (answers[currentQuestion] === null) {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = index;
      setAnswers(newAnswers);

      if (questions[currentQuestion].answerOptions[index].isCorrect) {
        setScore(prevScore => prevScore + 1); 
      }

      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
      } else {
        setShowScore(true);
        await handleSubmitQuiz(score + 1); 
      }
    }
  };

  useEffect(() => {
    if (showScore) {
      handleSubmitQuiz(score + 1); 
    }
  }, [showScore]);

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
        console.error("Error submitting quiz result: ", error.message);
      }
    } else {
      alert("No user authenticated");
    }
  };

  const handleBackToContent = () => {
    navigate('/ContentPage');
  };

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
