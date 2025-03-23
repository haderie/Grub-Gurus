import { DatabaseRecipe } from '../../../types/types';
import './index.css';
import useRecipeCard from '../../../hooks/useRecipeCard';

/**
 * RecipeCard component displays a single recipe with its name, views, and ingredients.
 *
 * @param recipe: The recipe object to display.
 */
const RecipeCard = ({ recipe }: { recipe: DatabaseRecipe }) => {
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

  return (
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
        <div className='recipe-video'>
          <h3>Video Tutorial:</h3>
          <a href={recipe.video} target='_blank' rel='noopener noreferrer'>
            Watch Video
          </a>
        </div>
      )}

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
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
            />
            <label>Time:</label>
            <input
              type='time'
              value={selectedTime}
              onChange={e => setSelectedTime(e.target.value)}
            />
            {/* Color Picker */}
            <label>Select a Color for Your Recipe:</label>
            <br />
            <input
              type='color'
              value={selectedColor}
              onChange={e => setSelectedColor(e.target.value)}
              style={{
                width: '60px',
                marginTop: '2%',
                cursor: 'pointer',
                border: 'none',
                backgroundColor: selectedColor,
              }}
            />
            <br />
            <button onClick={() => handleConfirm(recipe)}>Confirm</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeCard;
