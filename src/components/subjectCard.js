
import React from 'react';
import { Card, Tooltip, OverlayTrigger, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import "../styles/subjectCardcustom.css";

const SubjectCard = ({ title, summary, icon, link }) => {
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {summary}
    </Tooltip>
  );

  return (
    <OverlayTrigger
      placement="top"
      delay={{ show: 250, hide: 400 }}
      overlay={renderTooltip}
    >
      <Card className="subject-card">
        <Card.Img variant="top" src={icon} alt={`${title} Icon`} />
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <div className="button-container">
            <Link to={`/ContentPage`}>
              <Button variant="primary">Content</Button>
            </Link>
            <Link to={`/Quiz`}>
              <Button variant="secondary">Quiz</Button>
            </Link>
          </div>
        </Card.Body>
      </Card>
    </OverlayTrigger>
  );
};

export default SubjectCard;