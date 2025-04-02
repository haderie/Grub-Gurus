import React from 'react';
import ReactPlayer from 'react-player';
import './index.css';
import { Card, CardContent, Typography, Stack, Chip, Box, CardMedia, Button } from '@mui/material';
import { CalendarToday } from '@mui/icons-material';
import { PopulatedDatabaseRecipe } from '../../../types/types';
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
    <Card sx={{ maxWidth: 800, mx: 'auto', mt: 2, p: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant='h5' fontWeight='bold' color='#6A9C89' gutterBottom>
          {recipe.title}
        </Typography>
        {/* Add to Calendar Button */}
        <Button
          variant='contained'
          startIcon={<CalendarToday />}
          sx={{ backgroundColor: '#FFF5E4', color: '#FFA725', borderRadius: '5px' }}
          onClick={() => setShowModal(true)}>
          Add Recipe to Calendar
        </Button>
        <Typography variant='subtitle1' fontWeight='bold' mt={2}>
          Description:
        </Typography>
        <Typography variant='body1' sx={{ fontSize: '16px', color: '#3E3232' }} gutterBottom>
          {recipe.description}
        </Typography>

        <Typography variant='subtitle1' fontWeight='bold' mt={2}>
          Cooking Time:
        </Typography>
        <Typography variant='body2' sx={{ fontSize: '16px', color: '#3E3232' }}>
          {recipe.cookTime} minutes
        </Typography>

        <Typography variant='subtitle1' fontWeight='bold' mt={2}>
          Ingredients:
        </Typography>
        <ul style={{ paddingLeft: '16px', marginTop: '4px' }}>
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>

        <Typography variant='subtitle1' fontWeight='bold' mt={2}>
          Instructions:
        </Typography>
        <Typography variant='body2' component='p' sx={{ fontSize: '16px', color: '#3E3232' }}>
          {recipe.instructions}
        </Typography>

        <Typography variant='subtitle1' fontWeight='bold' mt={2} mb={1}>
          Tags:
        </Typography>
        <Stack direction='row' spacing={1} flexWrap='wrap'>
          {recipe.tags.map(tag => (
            <Chip
              key={String(tag._id)}
              label={tag.name}
              color='primary'
              variant='outlined'
              sx={{
                'mt': 2,
                'color': '#FFA725',
                'font-size': '16px',
                'borderColor': '#FFA725',
                '&:hover': {
                  backgroundColor: '#FFE5C2',
                },
              }}
            />
          ))}
        </Stack>

        {recipe.video && (
          <Box mt={2}>
            <Typography variant='subtitle1' fontWeight='bold'>
              Video Tutorial:
            </Typography>
            <CardMedia>
              <ReactPlayer url={recipe.video} width='50%' height='auto' />
            </CardMedia>
          </Box>
        )}
      </CardContent>

      {/* Modal for Date and Time Selection */}
      {showModal && (
        <div className='modal'>
          <div
            className='modal-content'
            style={{
              padding: '20px',
              maxWidth: '400px',
              margin: '0 auto',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            }}>
            <h2 style={{ marginBottom: '20px' }}>Select Date & Time</h2>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
                Date:
              </label>
              <input
                type='date'
                value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
                onChange={e => {
                const [year, month, day] = e.target.value.split('-').map(Number);
                const localDate = new Date(year, month - 1, day); // Month is 0-based in JS Date
                setSelectedDate(localDate);
              }}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '16px',
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
                Time:
              </label>
              <input
                type='time'
                value={selectedTime}
                onChange={e => setSelectedTime(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '16px',
                }}
              />
            </div>

            {/* Color Picker */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
                Select Recipe Color:
              </label>
              <input
                type='color'
                value={selectedColor}
                onChange={e => setSelectedColor(e.target.value)}
                style={{
                  width: '40px',
                  height: '40px',
                  border: 'none',
                  cursor: 'pointer',
                  marginBottom: '10px',
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
              <button
                onClick={() => handleConfirm(recipe)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6A9C89',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}>
                CONFIRM
              </button>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#FFA725',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}>
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default RecipeCard;
