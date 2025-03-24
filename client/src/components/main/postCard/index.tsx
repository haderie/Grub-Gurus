import React from 'react';
import './index.css';
import { DatabaseRecipe } from '@fake-stack-overflow/shared';
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
  username: string;
  recipe: DatabaseRecipe;
  text?: string;
  datePosted: Date;
  likes: string[];
  saves: string[];
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
const PostCard: React.FC<{ post: PostCardProps }> = ({ post }) => {
  console.log('PostCard received username:', post.username);

  const { likes, saves, handleLike, handleSave } = usePostCard(
    post.likes,
    post.saves,
    post.username,
  );

  return (
    <div className='post-card'>
      <h3 className='username'>@{post.username}</h3>
      <RecipeCard recipe={post.recipe} />

      {post.text && <p className='post-text'>{post.text}</p>}

      {/* Likes & Saves */}
      <div className='post-actions'>
        <button onClick={handleLike}>❤️ {likes.length} Likes</button>
        <button onClick={handleSave}>🔖 {saves.length} Saves</button>
      </div>
    </div>
  );
};

export default PostCard;
