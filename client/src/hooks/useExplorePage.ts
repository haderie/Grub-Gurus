import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PopulatedDatabasePost, TagData } from '../types/types';
import { getPosts } from '../services/postService';

/**
 * Custom hook for managing the tag page's state and navigation.
 *
 * @returns tlist - An array of tag data retrieved from the server
 * @returns clickTag - Function to navigate to the home page with the selected tag as a URL parameter.
 */
const useExplorePage = () => {
  const navigate = useNavigate();
  const [qlist, setQlist] = useState<PopulatedDatabasePost[]>([]);
  


  useEffect(() => {
    /**
     * Function to fetch questions based on the filter and update the question list.
     */
    const fetchData = async () => {
      try {
        const res = await getPosts();
        console.log("posts", res);
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
export default useExplorePage;