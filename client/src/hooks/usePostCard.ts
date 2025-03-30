import { useState } from 'react';
import { ObjectId } from 'mongodb';
import { likePost } from '../services/postService';
import { PopulatedDatabasePost } from '../types/types';
import { savePost } from '../services/userService';
import useUserContext from './useUserContext';

const usePostCard = (
  initialLikes: string[],
  initialSaves: string[],
  username: string,
  postID: ObjectId,
  post: PopulatedDatabasePost,
) => {
  const [likes, setLikes] = useState(initialLikes);
  const [saves, setSaves] = useState(post.saves);
  const { user: currentUser } = useUserContext();

  const handleLike = async () => {
    const isLiked = likes.includes(username);
    if (isLiked) {
      setLikes(likes.filter(user => user !== username)); // Remove like
    } else {
      setLikes([...likes, username]); // Add like
    }
    try {
      await likePost(postID, username);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(`Error liking post: ${error}`);
    }
  };

  const handleSave = async () => {
    try {
      const isSaved = saves.includes(currentUser.username);
      if (isSaved) {
        setSaves(saves.filter(user => user !== currentUser.username)); // remove saves
        await savePost(currentUser.username, postID, 'remove');
      } else {
        setSaves([...saves, currentUser.username]); // add saves
        const success = await savePost(currentUser.username, postID, 'save');
        if (!success) {
          // Revert the state if the request fails
          setSaves(saves);
          // eslint-disable-next-line no-console
          console.error('Failed to update saves. Please try again.');
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error saving post:', error);
    }
    await savePost(username, postID);
  };
  return { likes, saves, handleLike, handleSave };
};

export default usePostCard;
