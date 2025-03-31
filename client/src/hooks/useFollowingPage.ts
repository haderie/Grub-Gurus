import { useEffect, useState } from 'react';
import { PopulatedDatabaseChat } from '../types/types';
import { getFollowingPosts } from '../services/postService';
import useUserContext from './useUserContext';

/**
 * Custom hook for managing the tag page's state and navigation.
 *
 * @returns tlist - An array of tag data retrieved from the server
 * @returns clickTag - Function to navigate to the home page with the selected tag as a URL parameter.
 */
const useFollowingPage = () => {
  const [qlist, setQlist] = useState<PopulatedDatabaseChat[]>([]);
  const { user, socket } = useUserContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getFollowingPosts(user.username);
        setQlist(res);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    };

    /**
     * Handles real-time updates from the socket.
     */
    const handlePostUpdate = (updatedPost: PopulatedDatabasePost) => {
      setQlist(prevQlist => {
        const index = prevQlist.findIndex(post => post._id === updatedPost._id);
        if (index !== -1) {
          // Replace the updated post in the list
          return prevQlist.map(post => (post._id === updatedPost._id ? updatedPost : post));
        }
        return [updatedPost, ...prevQlist]; // Add new post if not found
      });
    };

    fetchData();

    if (socket) {
      socket.on('postUpdate', handlePostUpdate);
    }

    return () => {
      if (socket) {
        socket.off('postUpdate', handlePostUpdate);
      }
    };
  }, [user.username, socket]);

  return { qlist };
};
export default useFollowingPage;
