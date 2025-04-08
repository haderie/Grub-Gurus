import { useState } from 'react';
import { ObjectId } from 'mongodb';
import { likePost } from '../services/postService';
import { PopulatedDatabasePost } from '../types/types';
import { savePost } from '../services/userService';
import useUserContext from './useUserContext';

/**
 * Custom hook to manage the likes and saves for a post card.
 * This hook handles the state of likes and saves, and provides handlers for liking and saving a post.
 *
 * @param initialLikes - An array of users who have liked the post initially.
 * @param initialSaves - An array of users who have saved the post initially.
 * @param username - The username of the current user, who will be adding/removing likes and saves.
 * @param postID - The ID of the post to be liked or saved.
 * @param post - The full post data object containing post details like the username of the poster and saves.
 *
 * @returns {likes, saves, handleLike, handleSave}
 * - likes: Current state of users who have liked the post.
 * - saves: Current state of users who have saved the post.
 * - handleLike: Function to toggle like status for the current user on the post.
 * - handleSave: Function to toggle save status for the current user on the post.
 */
const usePostCard = (
  initialLikes: string[],
  initialSaves: string[],
  username: string,
  postID: ObjectId,
  post: PopulatedDatabasePost,
) => {
  const [likes, setLikes] = useState(initialLikes);
  const [saves, setSaves] = useState(initialSaves);
  const { user: currentUser } = useUserContext();

  const handleLike = async () => {
    const isLiked = likes.includes(currentUser.username);
    if (isLiked) {
      setLikes(likes.filter(user => user !== currentUser.username)); // Remove like
    } else {
      setLikes([...likes, currentUser.username]); // Add like
    }
    try {
      await likePost(postID, currentUser.username);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(`Error liking post: ${error}`);
    }
  };

  const handleSave = async () => {
    try {
      // Prevent the user from saving their own post
      if (currentUser.username === post.username) {
        // eslint-disable-next-line no-alert
        alert('You cannot save your own post.');
        return;
      }

      const isSaved = saves.includes(currentUser.username);
      if (isSaved) {
        setSaves(saves.filter(user => user !== currentUser.username)); // remove saves
        await savePost(currentUser.username, postID, 'remove');
      } else {
        setSaves([...saves, currentUser.username]); // add saves
        await savePost(currentUser.username, postID, 'save');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error saving post:', error);
    }
  };
  return { likes, saves, handleLike, handleSave };
};

export default usePostCard;
