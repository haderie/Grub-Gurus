import './index.css';
import React from 'react';
import { Box, Button, TextField, CircularProgress, Typography, Stack, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useNewPost from '../../../hooks/useNewPost';

/**
 * NewPost component allows users to create a new post.
 */
const NewPost = () => {
  const {
    title,
    setTitle,
    description,
    instructions,
    ingredientNames,
    setDescription,
    setInstructions,
    setIngredientNames,
    tagNames,
    setTagNames,
    cookTime,
    setCookTime,
    textErr,
    tagErr,
    createPost,
    setVideoUrl,
    searchTerm,
    setSearchTerm,
    videoResults,
    setVideoResults,
    searchYouTube,
    loading,
  } = useNewPost();
  const navigate = useNavigate();

  const predefinedTags = [
    'DR-Gluten-free',
    'DR-Vegetarian',
    'DR-Vegan',
    'DR-Halal',
    'MT-Breakfast',
    'MT-Lunch',
    'MT-Dinner',
    'MT-Snacks',
    'SL-Beginner',
    'SL-Intermediate',
    'SL-Advanced',
  ];

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: 'auto',
        mt: 4,
        p: 3,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 3,
      }}>
      <Typography variant='h5' fontWeight='bold' gutterBottom>
        Create a New Post
      </Typography>

      {/* Post Title */}
      <TextField
        label='Post Title*'
        fullWidth
        sx={{
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor: '#6A9C89', // Custom border color
            },
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#6A9C89', // Custom label color on focus
          },
        }}
        margin='normal'
        helperText={
          title.length > 100
            ? 'Title cannot exceed 100 characters.'
            : 'Limit title to 100 characters or less.'
        }
        value={title}
        onChange={e => setTitle(e.target.value.length <= 100 ? e.target.value : title)}
        error={title.length > 100}
      />

      {/* Post Description */}
      <TextField
        label='Post Description*'
        fullWidth
        multiline
        rows={2}
        sx={{
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor: '#6A9C89',
            },
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#6A9C89',
          },
        }}
        margin='normal'
        helperText='Provide a short description for your post.'
        value={description}
        onChange={e => setDescription(e.target.value)}
        error={!!textErr}
      />

      {/* Video Search */}
      <Stack direction='row' spacing={2} alignItems='center' mt={2}>
        <TextField
          label='Attach Video (Optional)'
          fullWidth
          helperText='Search for a YouTube video.'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: '#6A9C89',
              },
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#6A9C89',
            },
          }}
        />
        <Button
          variant='contained'
          sx={{
            'backgroundColor': '#FFA725',
            'color': '#FFF5E4',
            '&:disabled': {
              backgroundColor: '#E6A100',
            },
          }}
          onClick={searchYouTube}
          disabled={loading}>
          {loading ? <CircularProgress size={20} /> : 'Search'}
        </Button>
      </Stack>

      {/* Video Search Results */}
      {videoResults.length > 0 && (
        <Stack spacing={2} mt={2}>
          {videoResults.map(video => (
            <Box
              key={video.id.videoId}
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: '#f5f5f5',
                p: 2,
                borderRadius: 2,
              }}>
              <img
                src={video.snippet.thumbnails.default.url}
                alt={video.snippet.title}
                style={{ width: 80, height: 50, marginRight: 12 }}
              />
              <Box>
                <Typography variant='body2'>{video.snippet.title}</Typography>
                <Button
                  variant='contained'
                  size='small'
                  sx={{ mt: 1, backgroundColor: '#FFA725', color: '#FFF5E4' }}
                  onClick={() => {
                    setSearchTerm(`https://www.youtube.com/watch?v=${video.id.videoId}`);
                    setVideoUrl(`https://www.youtube.com/watch?v=${video.id.videoId}`);
                    setVideoResults([]);
                  }}>
                  Select Video
                </Button>
              </Box>
            </Box>
          ))}
        </Stack>
      )}

      {/* Recipe Ingredients */}
      <TextField
        label='Recipe Ingredients'
        fullWidth
        margin='normal'
        helperText='Add ingredients separated by commas and a whitespace. e.g "eggs , bread"'
        value={ingredientNames}
        onChange={e => setIngredientNames(e.target.value)}
        error={!!textErr}
        sx={{
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor: '#6A9C89', // Custom border color
            },
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#6A9C89', // Custom label color on focus
          },
        }}
      />

      {/* Recipe Instructions */}
      <TextField
        label='Recipe Instructions'
        fullWidth
        multiline
        rows={4}
        margin='normal'
        helperText='Provide detailed instructions.'
        value={instructions}
        onChange={e => setInstructions(e.target.value)}
        error={!!textErr}
        sx={{
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor: '#6A9C89', // Custom border color
            },
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#6A9C89', // Custom label color on focus
          },
        }}
      />

      {/* Cook Time */}
      <TextField
        label='Cook Time (in minutes)*'
        helperText='Please enter a positive number. Any non-numeric or negative values will reset the cook time to 0.'
        fullWidth
        type='number'
        margin='normal'
        value={cookTime === 0 ? '' : cookTime}
        onChange={e => {
          const newValue = e.target.value;
          const parsedValue = Number(newValue);

          // Check if it's a valid number and ensure it's non-negative
          if (!Number.isNaN(parsedValue) && parsedValue >= 0) {
            setCookTime(parsedValue);
          } else {
            setCookTime(0); // Default to 0 if not a valid number or negative
          }
        }}
        error={!!textErr}
        sx={{
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor: '#6A9C89',
            },
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#6A9C89',
          },
        }}
      />

      {/* Tags */}
      <TextField
        label='Tags*'
        fullWidth
        margin='normal'
        helperText='Add tags separated by commas and a whitespace. e.g "eggs , bread"'
        value={tagNames}
        onChange={e => setTagNames(e.target.value)}
        error={!!tagErr}
        sx={{
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor: '#6A9C89',
            },
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#6A9C89',
          },
        }}
      />

      {/* Predefined Tags as Chips */}
      <Box mt={2}>
        <Typography variant='body2' sx={{ fontStyle: 'italic', marginBottom: 1 }}>
          Suggested Tags:
        </Typography>
        <Stack
          direction='row'
          spacing={0.5} // Adjust spacing for better fit
          flexWrap='wrap'
          justifyContent='start' // Align tags nicely
          sx={{ gap: '4px', marginRight: '2px' }}>
          {predefinedTags.map(tag => (
            <Chip
              key={tag}
              label={tag}
              variant={tagNames.includes(tag) ? 'filled' : 'outlined'}
              onClick={() =>
                setTagNames(prev =>
                  prev.includes(tag) ? prev.replace(` ${tag}`, '') : `${prev} ${tag}`,
                )
              }
              sx={{
                'backgroundColor': tagNames.includes(tag) ? '#FFF5E4' : 'transparent',
                'color': '#FFA725',
                'borderColor': '#FFA725',
                '&:hover': {
                  backgroundColor: '#FFE5C2',
                },
              }}
            />
          ))}
        </Stack>
      </Box>
      {/* Post Button */}
      <Stack direction='row' alignItems='center' justifyContent='space-between' mt={3}>
        <Button
          variant='contained'
          color='primary'
          sx={{ backgroundColor: '#6A9C89', color: '#FFF5E4', borderRadius: '5px' }}
          onClick={createPost}>
          Create Post
        </Button>
        <Button variant='contained' color='error' onClick={() => navigate(`/explore`)}>
          Cancel
        </Button>
        <Typography variant='caption' sx={{ color: 'red', fontWeight: 'bold', fontSize: '12px' }}>
          * Indicates mandatory fields
        </Typography>
      </Stack>
    </Box>
  );
};

export default NewPost;
