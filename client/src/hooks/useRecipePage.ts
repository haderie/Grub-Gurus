import { useEffect, useState } from 'react';
import { PopulatedDatabasePost } from '../types/types';
import { getPosts } from '../services/postService';

/**
 * Custom hook to fetch and manage the list of posts for the recipe page.
 * It fetches posts from the server on initial load and updates the post list.
 *
 * @returns An object containing the list of posts (qlist).
 */
const useRecipePage = () => {
  const [qlist, setQlist] = useState<PopulatedDatabasePost[]>([]);

  useEffect(() => {
    /**
     * Function to fetch posts based on the filter and update the post list.
     */
    const fetchData = async () => {
      try {
        const res = await getPosts();
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
export default useRecipePage;
