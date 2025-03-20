import React from 'react';
import './index.css';
import useExplorePage from '../../../hooks/useRecipePage';
import RecipeCard from '../recipeCard';
import PostRecipeButton from '../postRecipeButton';

/**
 * Represents the TagPage component which displays a list of tags
 * and provides functionality to handle tag clicks and ask a new question.
 */
const ExplorePage = () => {
  const { qlist } = useExplorePage();

  return (
    <>
      <div className='space_between right_padding'>
        <div className='bold_title'>All Posts</div>
        <PostRecipeButton />
      </div>
      <div id='question_list' className='question_list'>
        {qlist.map(q =>
          q ? (
            <div key={String(q._id)} className='recipe-item'>
              <RecipeCard recipe={q.recipe} />
              <p></p>
            </div>
          ) : null,
        )}
      </div>
    </>
  );
};

export default ExplorePage;
