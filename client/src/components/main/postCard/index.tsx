import React from 'react';
import './index.css';
import { PopulatedDatabasePost } from '@fake-stack-overflow/shared';
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
  );

  const formattedDate = new Date(post.datePosted).toLocaleString();

  return (
    <div className='post-card'>
      <h3 className='username'>@{post.username}</h3>
      <RecipeCard recipe={post.recipe} />

      {post.text ? (
        <p className='post-text'>{post.text}</p>
      ) : (
        <p className='post-text'>No description available</p>
      )}
      <p className='date-posted'>Posted on {formattedDate}</p>

      {/* Likes & Saves */}
      <div className='post-actions'>
        <button onClick={handleLike}>❤️ {likes.length} Likes</button>
        <button onClick={handleSave}>🔖 {saves.length} Saves</button>
      </div>
    </div>
  );
};

export default PostView;
