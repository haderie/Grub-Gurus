import React from 'react';
import ReactPlayer from 'react-player';
import { useNavigate } from 'react-router-dom';
import { PopulatedDatabaseRecipe } from '../../../types/types';
import './index.css';

/**
 * RecipeCard component displays a single recipe with its name, views, and ingredients.
 *
 * @param recipe: The recipe object to display.
 */
const RecipeCard = ({ recipe }: { recipe: PopulatedDatabaseRecipe }) => {
  const navigate = useNavigate();

  if (!recipe) {
    return <div>Loading...</div>;
  }

  /**
   * Function to navigate to the home page with the specified tag as a search parameter.
   *
   * @param tagName - The name of the tag to be added to the search parameters.
   */
  const clickTag = (tagName: string) => {
    const searchParams = new URLSearchParams();
    searchParams.set('tag', tagName);

    navigate(`/home?${searchParams.toString()}`);
  };

  return (
    <div className='recipe-card'>
      <div className='recipe-header'>
        <h1>{recipe.title}</h1>
      </div>
      <p className='recipe-description'>{recipe.description}</p>

      <h3>Cooking Time:</h3>
      <p>{recipe.cookTime} minutes</p>

      <h3>Ingredients:</h3>
      <ul className='recipe-ingredients'>
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>

      <h3>Instructions:</h3>
      <ul className='recipe-ingredients'>{recipe.instructions}</ul>

      {recipe.video && (
        <ReactPlayer
          url={recipe.video}
          width='50%'
          height='auto'
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            border: '2px solid red', // Temporary border to see if it's being rendered
          }}
        />
      )}

      <h3>Tags:</h3>
      <div className='recipe-tags'>
        {recipe.tags.map(tag => (
          <button
            key={String(tag._id)}
            className='recipe_tag_button'
            onClick={e => {
              e.stopPropagation();
              clickTag(tag.name);
            }}>
            {tag.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecipeCard;
