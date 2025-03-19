import React from 'react';
import { RecipeCalendarEvent } from '../../../../types/types';
import './index.css';

/**
 * RecipeCard component displays a single recipe with its name, views, and ingredients.
 *
 * @param recipe: The recipe object to display.
 */
const CalendarRecipeCard = ({ recipe }: { recipe: RecipeCalendarEvent }) => (
  <div className='recipe-card'>
    <div className='recipe-header'>
      <h1>{recipe.title}</h1>
    </div>

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
      <div className='recipe-video'>
        <h3>Video Tutorial:</h3>
        <a href={recipe.video} target='_blank' rel='noopener noreferrer'>
          Watch Video
        </a>
      </div>
    )}
  </div>
);

export default CalendarRecipeCard;
