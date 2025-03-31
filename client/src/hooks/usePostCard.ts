import { useState } from 'react';
import { ObjectId } from 'mongodb';
import { likePost, savePost } from '../services/postService';

const usePostCard = (
  initialLikes: string[],
  initialSaves: string[],
  username: string,
  postID: ObjectId,
) => {
  const [likes, setLikes] = useState(initialLikes);
  const [saves, setSaves] = useState(initialSaves);

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
    const isSaved = saves.includes(username);
    if (isSaved) {
      setSaves(saves.filter(user => user !== username)); // Remove save
    } else {
      setSaves([...saves, username]); // Add save
    }
  };

  return { likes, saves, handleLike, handleSave };
};

export default usePostCard;
