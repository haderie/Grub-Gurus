import './index.css';
import React from 'react';
import {
  Button,
  TextField,
  CircularProgress,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Stack,
} from '@mui/material';
import useAnswerForm from '../../../hooks/useAnswerForm';

/**
 * NewAnswerPage component allows users to submit an answer to a specific question.
 */
const NewAnswerPage = () => {
  const {
    text,
    textErr,
    setText,
    postAnswer,
    setVideoUrl,
    searchTerm,
    setSearchTerm,
    videoResults,
    setVideoResults,
    searchYouTube,
    loading,
  } = useAnswerForm();

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
        justifyContent: 'center',
      }}>
      {/* Answer Text Section */}
      <Typography variant='h5' fontWeight='bold'>
        Post a New Answer
      </Typography>

      {/* Question Text */}
      <TextField
        label='Answer*'
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
        helperText='Enter answer details.'
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

      {/* Post Answer Section */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
        <Button
          variant='contained'
          color='primary'
          onClick={postAnswer}
          sx={{
            mt: 2,
            borderRadius: '5px',
            fontSize: '14px',
            textTransform: 'none',
            backgroundColor: '#6A9C89',
            color: '#FFF5E4',
          }}>
          POST ANSWER
        </Button>
        <Typography variant='caption' sx={{ color: 'red', fontWeight: 'bold', fontSize: '12px' }}>
          * Indicates mandatory fields
        </Typography>
      </Box>
    </Box>
  );
};

export default NewAnswerPage;
