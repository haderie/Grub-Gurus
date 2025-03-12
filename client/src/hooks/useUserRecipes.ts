import { useEffect, useState } from 'react';
import axios from 'axios';
import { DatabaseRecipe } from '../types/types';
import { getRecipeByUsername } from '../services/recipeService';

const useUserRecipes = (userId: string) => {
  const [recipes, setRecipes] = useState<DatabaseRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log(userId);
    if (!userId) {
      setRecipes([]);
      setLoading(false);
      return;
    }

    const fetchRecipes = async () => {
      try {
        const response = await getRecipeByUsername(userId);
        setRecipes(response);
      } catch (err) {
        setError('Failed to load recipes.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [userId]);

  return { recipes, loading, error };
};

export default useUserRecipes;
