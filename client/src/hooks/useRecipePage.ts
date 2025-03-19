import { useEffect, useState } from 'react';
import { PopulatedDatabasePost } from '../types/types';
import { getPosts } from '../services/postService';

const useRecipePage = () => {
  const [qlist, setQlist] = useState<PopulatedDatabasePost[]>([]);

  useEffect(() => {
    /**
     * Function to fetch questions based on the filter and update the question list.
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
