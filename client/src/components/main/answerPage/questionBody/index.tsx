import React from 'react';
import ReactPlayer from 'react-player';
import { Box, Typography, Paper } from '@mui/material';
import { handleHyperlink } from '../../../../tool';

/**
 * Interface representing the props for the QuestionBody component.
 *
 * - views - The number of views the question has received.
 * - text - The content of the question, which may contain hyperlinks.
 * - askby - The username of the user who asked the question.
 * - meta - Additional metadata related to the question, such as the date and time it was asked.
 */
interface QuestionBodyProps {
  views: number;
  text: string;
  askby: string;
  meta: string;
  youtubeVideoUrl?: string;
}

/**
 * QuestionBody component that displays the body of a question.
 * It includes the number of views, the question content (with hyperlink handling),
 * the username of the author, and additional metadata.
 *
 * @param views The number of views the question has received.
 * @param text The content of the question.
 * @param askby The username of the question's author.
 * @param meta Additional metadata related to the question.
 */
const QuestionBody = ({ views, text, askby, meta, youtubeVideoUrl }: QuestionBodyProps) => (
  <Paper
    elevation={2}
    sx={{
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      padding: 2,
      gap: 2,
      marginBottom: 3,
    }}>
    {/* Left Section for Question Text */}
    <Box sx={{ flex: 1 }}>
      {/* Question Text Section with Hyperlinks */}
      <Typography variant='body1' sx={{ color: '#3E3232', lineHeight: 1.6 }}>
        {handleHyperlink(text)}
      </Typography>

      {/* Video Player Section (if youtubeVideoUrl is provided) */}
      {youtubeVideoUrl && (
        <Box sx={{ marginTop: 2 }}>
          <ReactPlayer
            url={youtubeVideoUrl}
            width='100%'
            height='auto'
            style={{
              maxWidth: '50%',
              maxHeight: '100%',
            }}
          />
        </Box>
      )}
    </Box>

    {/* Right Section for Metadata */}
    <Box
      sx={{
        minWidth: 150,
        textAlign: 'right',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
      {/* Author Name */}
      <Typography variant='subtitle1' sx={{ fontWeight: 'bold', color: '#6A9C89' }}>
        {askby}
      </Typography>

      {/* Meta Information */}
      <Typography variant='body2' sx={{ color: '#FFA725' }}>
        asked {meta}
      </Typography>
      <Typography variant='subtitle1' sx={{ color: '#3E3232' }}>
        {views} views
      </Typography>
    </Box>
  </Paper>
);

export default QuestionBody;
