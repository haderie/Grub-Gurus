import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import useRecipeCalendar from '../../../hooks/useRecipeCalendar';
import './index.css';
import CalendarRecipeCard from './calendarRecipeCard';

const localizer = momentLocalizer(moment);

const RecipeCalendar: React.FC = () => {
  const {
    recipeState,
    selectedDate,
    selectedTime,
    showForm,
    selectedRecipe,
    events,
    selectedColor,
    setSelectedColor,
    setRecipeState,
    setSelectedTime,
    handleSelectSlot,
    handleAddRecipe,
    handleEventClick,
    closeRecipeCard,
    setShowForm,
  } = useRecipeCalendar();

  return (
    <div style={{ height: 500, padding: '20px' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor='start'
        endAccessor='end'
        views={['month', 'week', 'day']}
        selectable={!showForm}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleEventClick}
        style={{ border: '1px solid #4caf50', borderRadius: '5px', backgroundColor: '#e8f5e9' }}
        eventPropGetter={event => ({
          style: {
            backgroundColor: event.color || '#4caf50',
            color: 'white',
            borderRadius: '4px',
            border: 'none',
          },
        })}
      />

      {/* Recipe Selection Form (Modal) */}
      {showForm && (
        <div className='modal'>
          <h3>Add Recipe</h3>
          <p>Selected Date: {selectedDate?.toDateString()}</p>

          {/* Input for custom recipe */}
          {/* Recipe Name */}
          <label>Recipe Title:</label>
          <input
            type='text'
            placeholder='Enter your recipe title'
            value={recipeState.title}
            onChange={e => setRecipeState({ ...recipeState, title: e.target.value })}
            style={{ padding: '8px', marginBottom: '10px', width: '100%' }}
          />
          {/* Time Picker */}
          <label>Select Time:</label>
          <input
            type='time'
            value={selectedTime}
            onChange={e => setSelectedTime(e.target.value)}
            style={{ padding: '8px', marginBottom: '10px', width: '100%' }}
          />
          {/* Ingredients */}
          <label>Ingredients:</label>
          <input
            type='text'
            placeholder='Enter your ingredients (comma separated)'
            value={recipeState.ingredients.join(', ')}
            onChange={e =>
              setRecipeState({
                ...recipeState,
                ingredients: e.target.value.split(',').map(ing => ing.trim()),
              })
            }
            style={{ padding: '8px', marginBottom: '10px', width: '100%' }}
          />
          {/* Instructions */}
          <label>Instructions:</label>
          <input
            type='text'
            placeholder='Enter your instructions'
            value={recipeState.instructions}
            onChange={e => setRecipeState({ ...recipeState, instructions: e.target.value })}
            style={{ padding: '8px', marginBottom: '10px', width: '100%' }}
          />
          {/* Cook Time */}
          <label>Cooktime (mins):</label>
          <input
            type='text'
            placeholder='Enter your cooktime in minutes'
            value={recipeState.cookTime}
            onChange={e => setRecipeState({ ...recipeState, cookTime: Number(e.target.value) })}
            style={{ padding: '8px', marginBottom: '10px', width: '100%' }}
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
          <button onClick={handleAddRecipe} disabled={!recipeState.title}>
            Add Recipe to Calendar
          </button>
          <button onClick={() => setShowForm(false)}>Cancel</button>
        </div>
      )}
      {/* Recipe Card Modal */}
      {selectedRecipe && (
        <>
          <div className='modal'>
            <CalendarRecipeCard recipe={selectedRecipe} />
            <button onClick={closeRecipeCard}>Close</button>
          </div>
        </>
      )}
    </div>
  );
};
export default RecipeCalendar;
