import { useState } from 'react';
import { ObjectId } from 'mongodb';
import { likePost, savePost } from '../services/postService';

const usePostCard = (
  initialLikes: string[],
  initialSaves: string[],
  username: string,
  postId: ObjectId,
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
    await likePost(username, postId);
  };

  const handleSave = async () => {
    const isSaved = saves.includes(username);
    if (isSaved) {
      setSaves(saves.filter(user => user !== username)); // Remove save
    } else {
      setSaves([...saves, username]); // Add save
    }
    await savePost(username, postId);
  };

  return { likes, saves, handleLike, handleSave };
};

export default usePostCard;
