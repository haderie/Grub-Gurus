import { useEffect, useState } from 'react';
import { PopulatedDatabaseRecipe } from '../types/types';
import { getRecipesByUsername } from '../services/recipeService';
import useUserContext from './useUserContext';
import { getUserByUsername } from '../services/userService';

/**
 * Custom hook to fetch and manage the user's recipes based on their username.
 * It handles loading state, error handling, and updates the recipes state
 * when the recipes are successfully fetched from the server.
 *
 * @param username The username of the user whose recipes need to be fetched.
 * @returns An object containing the recipes, loading state, and error message (if any).
 */
const useUserRecipes = (username: string) => {
  const { socket } = useUserContext();
  const [recipes, setRecipes] = useState<PopulatedDatabaseRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) {
      setRecipes([]);
      setLoading(false);
      return;
    }

    const fetchRecipes = async () => {
      try {
        const response = await getRecipesByUsername(username);
        if (response.length > 1) {
          const theUser = await getUserByUsername(username);
          theUser.certified = true;
        }
        setRecipes(response);
      } catch (err) {
        setError('Failed to load recipes.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();

  }, [username, socket]);

  return { recipes, loading, error };
};

export default useUserRecipes;
