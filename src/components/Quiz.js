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
      questionText: 'What is the capital of France?',
      answerOptions: [
        { answerText: 'New York', isCorrect: false },
        { answerText: 'London', isCorrect: false },
        { answerText: 'Paris', isCorrect: true },
        { answerText: 'Berlin', isCorrect: false },
      ],
    },{
      questionText: 'What is the capital of France?',
      answerOptions: [
        { answerText: 'New York', isCorrect: false },
        { answerText: 'London', isCorrect: false },
        { answerText: 'Paris', isCorrect: true },
        { answerText: 'Berlin', isCorrect: false },
      ],
    },{
      questionText: 'What is the capital of France?',
      answerOptions: [
        { answerText: 'New York', isCorrect: false },
        { answerText: 'London', isCorrect: false },
        { answerText: 'Paris', isCorrect: true },
        { answerText: 'Berlin', isCorrect: false },
      ],
    },
    // Add more questions as needed
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
        setScore(prevScore => prevScore + 1); // Increment score by 1
      }
  
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
      } else {
        // Since this is the last question, show the score and submit the results.
        setShowScore(true);
        // Call the submit function directly here.
        await handleSubmitQuiz(score + 1); // Pass the updated score to handleSubmitQuiz
      }
    }
  };
  
  useEffect(() => {
    // Call the submit function when showScore changes
    if (showScore) {
      handleSubmitQuiz(score + 1); // Pass the updated score to handleSubmitQuiz
    }
  }, [showScore]);

  const handleSubmitQuiz = async (quizScore) => {
    if (auth.currentUser) {
      const quizResultData = {
        userEmail: auth.currentUser.email,
        score: quizScore-1,
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
            <Card.Header as="h5">JavaScript Quiz</Card.Header>
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
