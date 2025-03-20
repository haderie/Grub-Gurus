import React from 'react';
import ReactPlayer from 'react-player';
import { DatabaseRecipe } from '../../../types/types';
import './index.css';

/**
 * RecipeCard component displays a single recipe with its name, views, and ingredients.
 *
 * @param recipe: The recipe object to display.
 */
const RecipeCard = ({ recipe }: { recipe: DatabaseRecipe }) => (
  <div className='recipe-card'>
    <div className='recipe-header'>
      <h1>{recipe.title}</h1>
      <span className='recipe-likes'>Likes: {recipe.numOfLikes}</span>
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
  </div>
);

export default RecipeCard;
