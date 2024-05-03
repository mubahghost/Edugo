import React from 'react';
import { Card, Tooltip, OverlayTrigger, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import "../styles/subjectCardcustom.css";

// SubjectCard component displays a card with subject information and links to content and quiz pages
const SubjectCard = ({ title, summary, icon, link }) => {
  // Function to render a tooltip with subject summary
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {summary}
    </Tooltip>
  );

  // Render the SubjectCard component
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
          {/* Links to content and quiz pages */}
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
