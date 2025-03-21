import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PopulatedDatabasePost } from '../types/types';
import { getPosts } from '../services/postService';

/**
 * Custom hook for managing the tag page's state and navigation.
 *
 * @returns tlist - An array of tag data retrieved from the server
 * @returns clickTag - Function to navigate to the home page with the selected tag as a URL parameter.
 */
const useFollowingPage = () => {
  const navigate = useNavigate();
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
export default useFollowingPage;
