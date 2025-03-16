import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import useRecipeCalendar from '../../../hooks/useRecipeCalendar';
import './index.css';

const localizer = momentLocalizer(moment);

const RecipeCalendar: React.FC = () => {
  const {
    events,
    recipe,
    selectedDate,
    showForm,
    setRecipe,
    handleSelectSlot,
    handleAddRecipe,
    setShowForm,
  } = useRecipeCalendar();

  return (
    <div style={{ height: 500, padding: '20px' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor='start'
        endAccessor='end'
        views={['month', 'week', 'day', 'agenda']}
        selectable={!showForm}
        onSelectSlot={handleSelectSlot}
        style={{ border: '1px solid #ddd', borderRadius: '5px' }}
      />

      {/* Recipe Selection Form (Modal) */}
      {showForm && (
        <div className='modal'>
          <h3>Add Recipe</h3>
          <p>Selected Date: {selectedDate?.toDateString()}</p>

          {/* Input for custom recipe */}
          {/* Recipe Name */}
          <input
            type='text'
            placeholder='Enter your recipe name'
            value={recipe.title}
            onChange={e => setRecipe({ ...recipe, title: e.target.value })}
            style={{ padding: '8px', marginBottom: '10px', width: '100%' }}
          />
          {/* Ingredients */}
          <input
            type='text'
            placeholder='Enter your ingredients'
            value={recipe.ingredients.join(', ')}
            onChange={e =>
              setRecipe({
                ...recipe,
                ingredients: e.target.value.split(',').map(ing => ing.trim()),
              })
            }
            style={{ padding: '8px', marginBottom: '10px', width: '100%' }}
          />
          {/* Instructions */}
          <input
            type='text'
            placeholder='Enter your instructions'
            value={recipe.instructions}
            onChange={e => setRecipe({ ...recipe, instructions: e.target.value })}
            style={{ padding: '8px', marginBottom: '10px', width: '100%' }}
          />
          {/* Cook Time */}
          <input
            type='text'
            placeholder='Enter your cooktime'
            value={recipe.cookTime}
            onChange={e => setRecipe({ ...recipe, cookTime: Number(e.target.value) })}
            style={{ padding: '8px', marginBottom: '10px', width: '100%' }}
          />
          <br />
          <button onClick={handleAddRecipe} disabled={!recipe.title}>
            Add Recipe to Calendar
          </button>
          <button onClick={() => setShowForm(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};
export default RecipeCalendar;
