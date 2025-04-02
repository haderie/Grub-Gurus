import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Stack,
  Button,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  Chip,
} from '@mui/material';
import useNewQuestion from '../../../hooks/useNewQuestion';
import Form from '../baseComponents/form';
import Input from '../baseComponents/input';
import TextArea from '../baseComponents/textarea';
import './index.css';

/**
 * NewQuestionPage component allows users to submit a new question with a title,
 * description, tags, and username.
 */
const NewQuestionPage = () => {
  const {
    title,
    setTitle,
    text,
    setText,
    tagNames,
    setTagNames,
    // optInForAI,
    // setOptInForAI,
    titleErr,
    textErr,
    tagErr,
    postQuestion,
    setVideoUrl,
    searchTerm,
    setSearchTerm,
    videoResults,
    searchYouTube,
    loading,
    setVideoResults,
  } = useNewQuestion();

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
      <Typography variant='h5' fontWeight='bold'>
        Ask a New Question
      </Typography>

      {/* Question Title */}
      <TextField
        label='Question Title*'
        fullWidth
        sx={{
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor: '#6A9C89', // Set custom border color on focus
            },
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#6A9C89', // Set custom label color on focus
          },
        }}
        margin='normal'
        helperText={
          title.length > 100
            ? 'Title cannot exceed 100 characters.'
            : 'Limit title to 100 characters or less.'
        }
        value={title}
        onChange={e => {
          const input = e.target.value;
          if (input.length <= 100) {
            setTitle(input);
          }
        }}
        error={title.length > 100}
      />

      {/* Question Text */}
      <TextField
        label='Question Details*'
        fullWidth
        multiline
        rows={2}
        sx={{
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor: '#6A9C89', // Set custom border color on focus
            },
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#6A9C89', // Set custom label color on focus
          },
        }}
        margin='normal'
        helperText='Provide details about your question.'
        value={text}
        onChange={e => setText(e.target.value)}
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
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: '#6A9C89',
              },
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#6A9C89',
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
            <Card key={video.id.videoId} sx={{ display: 'flex', alignItems: 'center' }}>
              <CardMedia
                component='img'
                sx={{ width: 80, height: 50, marginLeft: 2 }}
                image={video.snippet.thumbnails.default.url}
                alt={video.snippet.title}
              />
              <CardContent>
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
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {/* Tags */}
      <TextField
        label='Tags*'
        fullWidth
        margin='normal'
        helperText='Add keywords separated by whitespace.'
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
          sx={{ backgroundColor: '#6A9C89', color: '#FFF5E4' }}
          onClick={postQuestion}>
          Post Question
        </Button>
        <Typography variant='caption' sx={{ color: 'red', fontWeight: 'bold', fontSize: '12px' }}>
          * Indicates mandatory fields
        </Typography>
      </Stack>
    </Box>
  );
};

export default NewQuestionPage;
