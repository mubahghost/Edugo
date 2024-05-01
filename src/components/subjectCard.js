// Importing necessary React and Bootstrap components for the UI and styling
import React from 'react';
import { Card, Tooltip, OverlayTrigger, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import "../styles/subjectCardcustom.css";

// SubjectCard functional component to display a subject with tooltip and navigation buttons
const SubjectCard = ({ title, summary, icon, link }) => {
  // Function to render a tooltip; utilized by OverlayTrigger to show a summary on hover
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {summary} // Tooltip content derived from the 'summary' prop
    </Tooltip>
  );

  return (
    // OverlayTrigger wraps the Card to attach a tooltip to it
    <OverlayTrigger
      placement="top" // Tooltip appears above the element
      delay={{ show: 250, hide: 400 }} // Controls the delay of tooltip appearance and disappearance
      overlay={renderTooltip} // Passes the renderTooltip function to render the Tooltip component
    >
      <Card className="subject-card"> // Card component displays the subject information
        <Card.Img variant="top" src={icon} alt={`${title} Icon`} /> // Image at the top of the card
        <Card.Body> // Body of the card containing title and action buttons
          <Card.Title>{title}</Card.Title> // Title of the subject
          <div className="button-container"> // Container for navigation buttons
            <Link to={`/ContentPage`}> // Link to the content page specific to this subject
              <Button variant="primary">Content</Button> // Button to navigate to the content
            </Link>
            <Link to={`/Quiz`}> // Link to the quiz page specific to this subject
              <Button variant="secondary">Quiz</Button> // Button to navigate to the quiz
            </Link>
          </div>
        </Card.Body>
      </Card>
    </OverlayTrigger>
  );
};

export default SubjectCard; // Exporting the SubjectCard component for use in other parts of the application
