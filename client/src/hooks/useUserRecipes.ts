import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DatabaseRecipe } from '../types/types';
import { getRecipeByUsername } from '../services/recipeService';
import useUserContext from './useUserContext';

const useUserRecipes = (username: string) => {
  const { socket } = useUserContext();

  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState<string>('');
  const [recipes, setRecipes] = useState<DatabaseRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // let pageTitle = 'All Rec';
    let searchString = '';

    const searchQuery = searchParams.get('search');
    const tagQuery = searchParams.get('tag');

    if (searchQuery) {
      // pageTitle = 'Search Results';
      searchString = searchQuery;
    } else if (tagQuery) {
      // pageTitle = tagQuery;
      searchString = `[${tagQuery}]`;
    }

    setSearch(searchString);
  }, [searchParams]);

  useEffect(() => {
    if (!username) {
      setRecipes([]);
      setLoading(false);
      return;
    }

    const fetchRecipes = async () => {
      try {
        const response = await getRecipeByUsername(username);
        setRecipes(response);
      } catch (err) {
        setError('Failed to load recipes.');
      } finally {
        setLoading(false);
      }
    };

    // /**
    //  * Updates the recipe views when an update is received from the socket.
    //  *
    //  * @param updatedRecipe - The updated recipe object with new view count.
    //  */
    // const handleViewsUpdate = (updatedRecipe: DatabaseRecipe) => {
    //   setRecipes(prevRecipes =>
    //     prevRecipes.map(recipe => (recipe._id === updatedRecipe._id ? updatedRecipe : recipe)),
    //   );
    // };

    fetchRecipes();

    // socket.on('recipeViewsUpdate', handleViewsUpdate);

    // return () => {
    //   socket.off('recipeViewsUpdate', handleViewsUpdate);
    // };
  }, [username, search, socket]);

  return { recipes, loading, error };
};

export default useUserRecipes;
