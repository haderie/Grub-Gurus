import React from 'react';
import './index.css';
import { PopulatedDatabasePost } from '@fake-stack-overflow/shared';
import { ThumbUp, Bookmark } from '@mui/icons-material';
import { Box, Card, CardContent, Typography, Stack, Chip } from '@mui/material';
import RecipeCard from '../recipeCard';
import usePostCard from '../../../hooks/usePostCard';

/**
 * Interface representing the props for the PostCard component.
 *
 * - post - the populated post that is being displayed.
 */
interface PostCardProps {
  post: PopulatedDatabasePost;
}

/**
 * PostView component that displays the post.
 * It includes the number of views, the question content (with hyperlink handling),
 * the username of the author, and additional metadata.
 *
 * @param likes An array of usernames who liked the post.
 * @param saves An array of usernames who saved the post.
 * @param handleLike A function to handle liking the post.
 * @param handleSave A function to handle saving the post.
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
