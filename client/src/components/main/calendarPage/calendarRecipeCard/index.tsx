import React from 'react';
import ReactPlayer from 'react-player';
import { RecipeCalendarEvent } from '../../../../types/types';
import './index.css';

/**
 * RecipeCard component displays a single recipe with its name, views, and ingredients.
 *
 * @param recipe: The recipe object to display.
 */
const CalendarRecipeCard = ({ recipe }: { recipe: RecipeCalendarEvent }) => (
  <div
    className='recipe-card'
    style={{
      padding: '20px',
      backgroundColor: '#e8f5e9',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      maxWidth: '600px',
      margin: 'auto',
    }}>
    <div className='recipe-header' style={{ marginBottom: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#6A9C89' }}>{recipe.title}</h1>
    </div>

    <div style={{ marginBottom: '15px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>Cooking Time:</h3>
      <p style={{ fontSize: '16px', color: '#3E3232' }}>{recipe.cookTime} minutes</p>
    </div>

    <div style={{ marginBottom: '15px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>Ingredients:</h3>
      <ul style={{ paddingLeft: '20px', color: '#3E3232' }}>
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index} style={{ fontSize: '16px' }}>
            {ingredient}
          </li>
        ))}
      </ul>
    </div>

    <div style={{ marginBottom: '15px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>Instructions:</h3>
      <p style={{ fontSize: '16px', color: '#3E3232' }}>{recipe.instructions}</p>
    </div>

    {recipe.video && (
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>Video Tutorial:</h3>
        <ReactPlayer
          url={recipe.video}
          width='100%'
          height='auto'
          style={{
            maxWidth: '100%',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        />
      </div>
    )}
  </div>
);

export default CalendarRecipeCard;
