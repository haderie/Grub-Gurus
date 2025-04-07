import { useEffect, useState } from 'react';
import { PopulatedDatabasePost } from '../types/types';
import { getPosts } from '../services/postService';
import useUserContext from './useUserContext';

/**
 * Custom hook for managing the explore page's state and real-time updates.
 *
 * @returns qlist - An array of posts retrieved from the server.
 */
const useExplorePage = () => {
  const [qlist, setQlist] = useState<PopulatedDatabasePost[]>([]);
  const { socket } = useUserContext();

  useEffect(() => {
    /**
     * Function to fetch posts and update the state.
     */
    const fetchData = async () => {
      try {
        const res = await getPosts();
        setQlist(res);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching posts:', error);
      }
    };

    /**
     * Handles real-time updates from the socket.
     */
    const handlePostUpdate = (updatedPost: PopulatedDatabasePost) => {
      // eslint-disable-next-line no-console
      console.log('Received post update:', updatedPost);
      setQlist(prevQlist => [updatedPost, ...prevQlist]);
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
  }, [socket]);

  return { qlist };
};

export default useExplorePage;
