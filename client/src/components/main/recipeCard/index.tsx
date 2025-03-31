import React from 'react';
import ReactPlayer from 'react-player';
import { PopulatedDatabaseRecipe } from '../../../types/types';
import './index.css';
import useRecipeCard from '../../../hooks/useRecipeCard';

/**
 * RecipeCard component displays a single recipe with its name, views, and ingredients.
 *
 * @param recipe: The recipe object to display.
 */
const RecipeCard = ({ recipe }: { recipe: PopulatedDatabaseRecipe }) => {
  const {
    showModal,
    selectedDate,
    selectedTime,
    selectedColor,
    setSelectedColor,
    handleConfirm,
    setShowModal,
    setSelectedDate,
    setSelectedTime,
  } = useRecipeCard();
  if (!recipe) {
    return <div>Loading...</div>;
  }

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

      <h3>Tags:</h3>
      <div className='recipe-tags'>
        {recipe.tags.map(tag => (
          <div key={String(tag._id)} className='tag-box'>
            {tag.name}
          </div>
        ))}
      </div>
      <div className='recipe-video'>
        <h3>Video Tutorial:</h3>

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

      {/* Add to Calendar Button */}
      <button className='add-to-calendar-btn' onClick={() => setShowModal(true)}>
        Add to Calendar
      </button>

      {/* Modal for Date and Time Selection */}
      {showModal && (
        <div className='modal'>
          <div className='modal-content'>
            <h2>Select Date & Time</h2>
            <label>Date:</label>
            <input
              type='date'
              value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
              onChange={e => setSelectedDate(new Date(e.target.value))}
            />
            <label>Time:</label>
            <input
              type='time'
              value={selectedTime}
              onChange={e => setSelectedTime(e.target.value)}
            />
            {/* Color Picker */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label>Select a Color for Your Recipe:</label>
              <br />
              <input
                type='color'
                value={selectedColor}
                onChange={e => setSelectedColor(e.target.value)}
                style={{
                  width: '40px',
                  height: '40px',
                  cursor: 'pointer',
                  border: 'none',
                  marginTop: '3%',
                  backgroundColor: selectedColor,
                }}
              />
            </div>
            <button onClick={() => handleConfirm(recipe)}>Confirm</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeCard;
