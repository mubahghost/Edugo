import React from 'react';
import { Card, Button } from 'react-bootstrap';
// Make sure the path is correct and that SubjectCard.css exists in the specified directory.
import "../styles/SubjectCard.css";

// Your React component code follows here...

const SubjectCardAdmin = ({ id, title, summary, icon, className, link, onEdit, onRemove }) => {
  return (
    <Card className={`subject-card ${className}`}>
      <Card.Img variant="top" src={icon} />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{summary}</Card.Text>
        <Button variant="primary" onClick={onEdit}>Edit</Button>
        <Button variant="danger" onClick={() => onRemove(id)}>Remove</Button> {/* Add remove button */}
      </Card.Body>
    </Card>
  );
};

export default SubjectCardAdmin;
