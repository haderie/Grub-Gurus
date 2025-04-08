import { useEffect, useState } from 'react';
import { PopulatedDatabasePost } from '../types/types';
import { getFollowingPosts } from '../services/postService';
import useUserContext from './useUserContext';

/**
 * Custom hook for managing the state and data fetching for the following page.
 * This hook fetches the posts from users that the current user is following and updates the state accordingly.
 * It also provides a function to navigate to the home page with the selected tag as a URL parameter.
 *
 * @returns qlist - An array of posts from users that the current user is following, retrieved from the server.
 */
const useFollowingPage = () => {
  const [qlist, setQlist] = useState<PopulatedDatabasePost[]>([]);
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
