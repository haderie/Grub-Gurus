import { Button } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * CreatePostButton component that renders a button for navigating to the
 * "New Post" page. When clicked, it redirects the user to the page
 * where they can create a new post.
 */
const CreateRecipeButton = () => {
  const navigate = useNavigate();

  /**
   * Function to handle navigation to the "New Post" page.
   */
  const handleNewPost = () => {
    navigate('/new/recipePost');
  };

  return (
    <Button
      variant='contained'
      color='primary'
      onClick={handleNewPost}
      sx={{
        borderRadius: '5px',
        textTransform: 'none',
        fontSize: '16px',
        backgroundColor: '#6A9C89',
      }}>
      CREATE NEW RECIPE
    </Button>
  );
};

export default CreateRecipeButton;
