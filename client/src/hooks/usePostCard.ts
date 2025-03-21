import { useState } from 'react';

const usePostCard = (initialLikes: string[], initialSaves: string[], username: string) => {
  const [likes, setLikes] = useState(initialLikes);
  const [saves, setSaves] = useState(initialSaves);

  // Handle like action
  const handleLike = () => {
    const isLiked = likes.includes(username);
    if (isLiked) {
      setLikes(likes.filter(user => user !== username)); // Remove like
    } else {
      setLikes([...likes, username]); // Add like
    }
    // Here you can trigger an API call to persist the changes
  };

  // Handle save action
  const handleSave = () => {
    const isSaved = saves.includes(username);
    if (isSaved) {
      setSaves(saves.filter(user => user !== username)); // Remove save
    } else {
      setSaves([...saves, username]); // Add save
    }
    // Here you can trigger an API call to persist the changes
  };

  return { likes, saves, handleLike, handleSave };
};

export default usePostCard;
