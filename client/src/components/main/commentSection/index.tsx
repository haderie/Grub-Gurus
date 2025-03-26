import React, { useState } from 'react';
import {
  Button,
  TextField,
  Typography,
  Box,
  Collapse,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Comment, DatabaseComment } from '../../../types/types';
import { getMetaData } from '../../../tool';
import useUserContext from '../../../hooks/useUserContext';

/**
 * Interface representing the props for the Comment Section component.
 *
 * - comments - list of the comment components
 * - handleAddComment - a function that handles adding a new comment, taking a Comment object as an argument
 */
interface CommentSectionProps {
  comments: DatabaseComment[];
  handleAddComment: (comment: Comment) => void;
}

/**
 * CommentSection component shows the users all the comments and allows the users add more comments.
 *
 * @param comments: an array of Comment objects
 * @param handleAddComment: function to handle the addition of a new comment
 */
const CommentSection = ({ comments, handleAddComment }: CommentSectionProps) => {
  const { user } = useUserContext();
  const [text, setText] = useState<string>('');
  const [textErr, setTextErr] = useState<string>('');
  const [showComments, setShowComments] = useState<boolean>(false);

  /**
   * Function to handle the addition of a new comment.
   */
  const handleAddCommentClick = () => {
    if (text.trim() === '' || user.username.trim() === '') {
      setTextErr(text.trim() === '' ? 'Comment text cannot be empty' : '');
      return;
    }

    const newComment: Comment = {
      text,
      commentBy: user.username,
      commentDateTime: new Date(),
    };

    handleAddComment(newComment);
    setText('');
    setTextErr('');
  };

  return (
    <Box sx={{ marginTop: 2 }}>
      {/* Toggle Button */}
      <Button
        variant='outlined'
        onClick={() => setShowComments(!showComments)}
        sx={{
          marginBottom: 2,
          backgroundColor: '#6A9C89',
          color: '#FFF5E4',
          border: 'none',
          borderRadius: 2,
        }}>
        {showComments ? 'Hide Replies' : 'View Replies'}
      </Button>

      {/* Comments Section */}
      <Collapse in={showComments}>
        <Box>
          {/* Comment List */}
          <List>
            {comments.length > 0 ? (
              comments.map(comment => (
                <ListItem key={String(comment._id)}>
                  <ListItemText
                    primary={
                      <Typography variant='body2' sx={{ color: '#3E3232' }}>
                        {comment.text} {/* Custom color for the comment text */}
                      </Typography>
                    }
                    secondary={
                      <Typography variant='body2' sx={{ color: '#FFA725' }}>
                        {comment.commentBy}, {getMetaData(new Date(comment.commentDateTime))}{' '}
                        {/* Custom color for the commenter and timestamp */}
                      </Typography>
                    }
                  />
                </ListItem>
              ))
            ) : (
              <Typography variant='body2' color='textSecondary'>
                No comments yet.
              </Typography>
            )}
          </List>

          {/* Add Comment Section */}
          <Box sx={{ marginTop: 1 }}>
            <TextField
              id='comment'
              label='Type your comment here.'
              variant='outlined'
              fullWidth
              multiline
              rows={1}
              value={text}
              onChange={e => setText(e.target.value)}
              error={!!textErr}
              helperText={textErr}
            />
            <Button
              variant='contained'
              color='primary'
              sx={{
                marginTop: 2,
                marginBottom: 2,
                borderRadius: 2,
                color: '#FFF5E4',
                backgroundColor: '#6A9C89',
              }}
              onClick={handleAddCommentClick}>
              Add Comment
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export default CommentSection;
