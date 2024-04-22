import React from 'react';
import { Card, Button } from 'react-bootstrap';
import "../styles/SubjectCard.css";

const SubjectCardAdmin = ({ id, title, summary, icon, className, link, onEdit, onRemove }) => {
  return (
    <Card className={`subject-card ${className}`}>
      <Card.Img variant="top" src={icon} />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{summary}</Card.Text>
        <Button variant="primary" onClick={onEdit}>Edit</Button>
        <Button variant="danger" onClick={() => onRemove(id)}>Remove</Button> 
      </Card.Body>
    </Card>
  );
};

export default SubjectCardAdmin;
