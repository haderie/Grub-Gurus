import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

/**
 * AskQuestionButton component that renders a button for navigating to the
 * "New Question" page. When clicked, it redirects the user to the page
 * where they can ask a new question.
 */
const AskQuestionButton = () => {
  const navigate = useNavigate();

  /**
   * Function to handle navigation to the "New Question" page.
   */
  const handleNewQuestion = () => {
    navigate('/new/question');
  };

  return (
    <Button
      variant='contained'
      color='primary'
      onClick={handleNewQuestion}
      sx={{
        borderRadius: '5px',
        textTransform: 'none',
        fontSize: '16px',
        backgroundColor: '#6A9C89',
      }}>
      ASK A QUESTION
    </Button>
  );
};

export default AskQuestionButton;
