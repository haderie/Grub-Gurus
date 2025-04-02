import React from 'react';
import { Box, Divider, Typography } from '@mui/material';
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
    setVideoUrl,
    searchTerm,
    setSearchTerm,
    videoResults,
    searchYouTube,
    loading,
    setVideoResults,
  } = useRecipeCalendar();

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: 2,
        }}>
        <Typography
          variant='h4'
          component='h1'
          sx={{
            fontWeight: 'bold',
            marginBottom: 2,
            color: '#333',
            fontSize: '24px',
            mb: 1,
            mt: 1,
          }}>
          Your Meal Planner
        </Typography>
        <Typography variant='body1' color='#3E3232' sx={{ maxWidth: '600px' }}>
          Keep track of your meals effortlessly! Add recipes manually by selecting a date or import
          them directly from posts on your feed.
        </Typography>
      </Box>
      <div style={{ height: 500, padding: '10px' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor='start'
          endAccessor='end'
          views={['month', 'week', 'day']}
          selectable={!showForm}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleEventClick}
          style={{
            border: '1px solid #C1D8C3',
            borderRadius: '5px',
            backgroundColor: '#C1D8C3',
            height: '100vh',
          }}
          eventPropGetter={event => ({
            style: {
              backgroundColor: event.color || '#6A9C89',
              color: 'FFF5E4',
              borderRadius: '5px',
              border: 'none',
            },
          })}
        />

        {/* Recipe Selection Form (Modal) */}
        {showForm && (
          <div className='modal'>
            <h3>Add Recipe</h3>
            <p>Selected Date: {selectedDate?.toDateString()}</p>

            <Divider sx={{ marginY: 2 }} />

            {/* Input for custom recipe */}
            <div className='form-group'>
              <label>Recipe Title*:</label>
              <input
                type='text'
                placeholder='Enter name of recipe.'
                value={recipeState.title}
                onChange={e => setRecipeState({ ...recipeState, title: e.target.value })}
                className='input-field'
              />
            </div>

            {/* Ingredients */}
            <div className='form-group'>
              <label>Recipe Ingredients*:</label>
              <input
                type='text'
                placeholder='Enter recipe ingredients (comma separated).'
                value={recipeState.ingredients.join(', ')}
                onChange={e =>
                  setRecipeState({
                    ...recipeState,
                    ingredients: e.target.value.split(',').map(ing => ing.trim()),
                  })
                }
                className='input-field'
              />
            </div>

            {/* Instructions */}
            <div className='form-group'>
              <label>Instructions*:</label>
              <input
                type='text'
                placeholder='Enter recipe instructions.'
                value={recipeState.instructions}
                onChange={e => setRecipeState({ ...recipeState, instructions: e.target.value })}
                className='input-field'
              />
            </div>

            {/* Cook Time */}
            <div className='form-group'>
              <label>Cook Time*:</label>
              <input
                type='text'
                placeholder='Enter your cook time in minutes.'
                value={recipeState.cookTime}
                onChange={e => setRecipeState({ ...recipeState, cookTime: Number(e.target.value) })}
                className='input-field'
              />
            </div>

            {/* YouTube Search for video */}
            <div className='form-group'>
              <label>Attach Video (Optional)</label>
              <div className='input-button-container'>
                <input
                  type='text'
                  placeholder='Search for a YouTube video.'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className='input-field'
                />
                <button
                  type='button'
                  onClick={searchYouTube}
                  disabled={loading}
                  className='search-button'>
                  {loading ? 'SEARCHING...' : 'SEARCH YOUTUBE'}
                </button>
              </div>
            </div>

            {/* Video Results */}
            {videoResults.length > 0 && (
              <div className='video-results'>
                {videoResults.map(video => (
                  <div key={video.id.videoId} className='video-item'>
                    <img src={video.snippet.thumbnails.default.url} alt={video.snippet.title} />
                    <p>{video.snippet.title}</p>
                    <button
                      onClick={() => {
                        setSearchTerm(`https://www.youtube.com/watch?v=${video.id.videoId}`);
                        setVideoUrl(`https://www.youtube.com/watch?v=${video.id.videoId}`);
                        setVideoResults([]);
                      }}
                      className='select-video-btn'>
                      SELECT VIDEO
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Time Picker */}
            <div className='form-group'>
              <label>Select Time*:</label>
              <input
                type='time'
                value={selectedTime}
                onChange={e => setSelectedTime(e.target.value)}
                className='input-field'
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
              <label style={{ fontWeight: 'bold' }}>Select Recipe Color:</label>
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

            {/* Action Buttons */}
            <div className='form-actions'>
              <button
                onClick={handleAddRecipe}
                disabled={!recipeState.title}
                className='submit-button'>
                ADD RECIPE
              </button>
              <button onClick={() => setShowForm(false)} className='cancel-button'>
                CANCEL
              </button>
            </div>
          </div>
        )}

        {/* Recipe Card Modal */}
        {selectedRecipe && (
          <div className='modal'>
            <CalendarRecipeCard recipe={selectedRecipe} />
            <button onClick={closeRecipeCard} className='close-btn'>
              CLOSE
            </button>
          </div>
        )}
      </div>
    </>
  );
};
export default RecipeCalendar;
