import { useEffect, useState } from 'react';
import { PopulatedDatabasePost } from '../types/types';
import { getFollowingPosts } from '../services/postService';
import useUserContext from './useUserContext';

/**
 * Custom hook for managing the tag page's state and navigation.
 *
 * @returns tlist - An array of tag data retrieved from the server
 * @returns clickTag - Function to navigate to the home page with the selected tag as a URL parameter.
 */
const useFollowingPage = () => {
  const [qlist, setQlist] = useState<PopulatedDatabasePost[]>([]);
  const { user } = useUserContext();

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

    fetchData();
  }, [user]);
  return { qlist };
};
export default useFollowingPage;
