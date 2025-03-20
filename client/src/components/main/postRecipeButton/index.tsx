import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * AskQuestionButton component that renders a button for navigating to the
 * "New Question" page. When clicked, it redirects the user to the page
 * where they can ask a new question.
 */
const PostRecipeButton = () => {
  const navigate = useNavigate();

  /**
   * Function to handle navigation to the "New Question" page.
   */
  const handleNewQuestion = () => {
    navigate('/new/recipePost');
  };

  return (
    <button
      className='bluebtn'
      onClick={() => {
        handleNewQuestion();
      }}>
      Post a Recipe
    </button>
  );
};

export default PostRecipeButton;
