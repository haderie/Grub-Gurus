import { useEffect, useState } from 'react';
import { PopulatedDatabaseChat } from '../types/types';
import { getFollowingPosts } from '../services/postService';

/**
 * Custom hook for managing the tag page's state and navigation.
 *
 * @returns tlist - An array of tag data retrieved from the server
 * @returns clickTag - Function to navigate to the home page with the selected tag as a URL parameter.
 */
const useFollowingPage = () => {
  const [qlist, setQlist] = useState<PopulatedDatabaseChat[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getFollowingPosts();
        setQlist(res);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    };

    fetchData();
  }, []);
  return { qlist };
};
export default useFollowingPage;
