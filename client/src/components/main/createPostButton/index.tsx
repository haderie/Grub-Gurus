import { Button } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * AskQuestionButton component that renders a button for navigating to the
 * "New Question" page. When clicked, it redirects the user to the page
 * where they can ask a new question.
 */
const CreatePostButton = () => {
  const navigate = useNavigate();

  /**
   * Function to handle navigation to the "New Question" page.
   */
  const handleNewPost = () => {
    navigate('/new/post');
  };

  return (
    <Button
      variant='contained'
      color='primary'
      onClick={handleNewPost}
      sx={{
        borderRadius: 3,
        textTransform: 'none',
        fontSize: '16px',
        backgroundColor: '#6A9C89',
      }}>
      CREATE NEW POST
    </Button>
  );
};

export default CreatePostButton;
