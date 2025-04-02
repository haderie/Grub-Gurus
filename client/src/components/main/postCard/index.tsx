import React from 'react';
import './index.css';
import { PopulatedDatabasePost } from '@fake-stack-overflow/shared';
import { ThumbUp, Bookmark } from '@mui/icons-material';
import { Box, Card, CardContent, Typography, Stack, Chip, IconButton } from '@mui/material';
import RecipeCard from '../recipeCard';
import usePostCard from '../../../hooks/usePostCard';

/**
 * Interface representing the props for the QuestionBody component.
 *
 * - views - The number of views the question has received.
 * - text - The content of the question, which may contain hyperlinks.
 * - askby - The username of the user who asked the question.
 * - meta - Additional metadata related to the question, such as the date and time it was asked.
 */
interface PostCardProps {
  post: PopulatedDatabasePost;
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
const PostView = ({ post }: PostCardProps) => {
  const { likes, saves, handleLike, handleSave } = usePostCard(
    post.likes,
    post.saves,
    post.username,
    post._id,
    post,
  );

  const formattedDate = new Date(post.datePosted).toLocaleString();

  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Card sx={{ boxShadow: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
        <CardContent>
          {/* Username */}
          <Typography variant='h6' color='#6A9C89' fontWeight='bold'>
            @{post.username}
          </Typography>

          {/* Recipe Card */}
          <RecipeCard recipe={post.recipe} />

          {/* Post Text */}
          <Typography variant='body1' color='#3E3232' sx={{ mt: 2 }}>
            {post.text || 'No description available'}
          </Typography>

          {/* Post Date */}
          <Typography variant='caption' color='#FFA725' sx={{ mt: 1, fontSize: '14px' }}>
            Posted on {formattedDate}
          </Typography>

          {/* Actions - Likes & Saves */}
          <Stack direction='row' spacing={2} sx={{ mt: 2 }}>
            <Chip
              icon={<ThumbUp />}
              label={`${likes?.length || 0} Likes`}
              onClick={handleLike}
              sx={{ backgroundColor: likes?.length ? '#FFF5E4' : 'transparent', color: '#FFA725' }}
            />
            <Chip
              icon={<Bookmark />}
              label={`${saves?.length || 0} Saves`}
              onClick={handleSave}
              sx={{ backgroundColor: saves?.length ? '#FFF5E4' : 'transparent', color: '#FFA725' }}
            />
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PostView;
