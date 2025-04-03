import React from 'react';
import ReactPlayer from 'react-player';
import Markdown from 'react-markdown';
import { Box, Typography, Paper } from '@mui/material';
import CommentSection from '../../commentSection';
import './index.css';
import { Comment, DatabaseComment } from '../../../../types/types';

/**
 * Interface representing the props for the AnswerView component.
 *
 * - text The content of the answer.
 * - ansBy The username of the user who wrote the answer.
 * - meta Additional metadata related to the answer.
 * - comments An array of comments associated with the answer.
 * - handleAddComment Callback function to handle adding a new comment.
 */
interface AnswerProps {
  text: string;
  ansBy: string;
  meta: string;
  comments: DatabaseComment[];
  youtubeVideoUrl?: string;
  handleAddComment: (comment: Comment) => void;
}

/**
 * AnswerView component that displays the content of an answer with the author's name and metadata.
 * The answer text is processed to handle hyperlinks, and a comment section is included.
 *
 * @param text The content of the answer.
 * @param ansBy The username of the answer's author.
 * @param meta Additional metadata related to the answer.
 * @param comments An array of comments associated with the answer.
 * @param handleAddComment Function to handle adding a new comment.
 */
const AnswerView = ({
  text,
  ansBy,
  meta,
  comments,
  youtubeVideoUrl,
  handleAddComment,
}: AnswerProps) => (
  <Paper
    elevation={2}
    sx={{
      display: 'flex',
      flexDirection: 'row',
      padding: 2,
      gap: 2,
      width: '100%', // Make sure the Paper container takes up full width
    }}>
    {/* Answer Text Section */}
    <Box sx={{ flex: 1 }}>
      <Typography variant='body1' sx={{ color: '#333', lineHeight: 1.6 }}>
        <Markdown>{text}</Markdown>
      </Typography>
      {youtubeVideoUrl && (
        <Box sx={{ marginTop: 2 }}>
          <ReactPlayer
            url={youtubeVideoUrl}
            width='50%'
            height='auto'
            style={{ maxWidth: '50%' }}
          />
        </Box>
      )}
    </Box>
    {/* Author & Meta Section */}
    <Box
      sx={{
        textAlign: 'right',
        justifyContent: 'right', // Align text to the right within this Box
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end', // Align content to the right side
        marginLeft: 'auto', // Push this Box all the way to the right of the parent container
      }}>
      <Typography variant='subtitle1' sx={{ fontWeight: 'bold', color: '#6A9C89' }}>
        {ansBy}
      </Typography>
      <Typography variant='body2' sx={{ color: '#FFA725' }}>
        answered {meta}
      </Typography>
      {/* Comments Section */}
      <CommentSection comments={comments} handleAddComment={handleAddComment} />
    </Box>
  </Paper>
);

export default AnswerView;
