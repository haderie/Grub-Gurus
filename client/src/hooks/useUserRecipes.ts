import { useEffect, useState } from 'react';
import { DatabaseRecipe } from '../types/types';
import { getRecipeByUsername } from '../services/recipeService';

const useUserRecipes = (username: string) => {
  const [recipes, setRecipes] = useState<DatabaseRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log(username);
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

    fetchRecipes();
  }, [username]);

  return { recipes, loading, error };
};

export default useUserRecipes;
