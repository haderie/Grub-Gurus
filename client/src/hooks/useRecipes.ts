import { useEffect, useState } from 'react';
import { DatabaseRecipe, SafeDatabaseUser } from '../types/types';
import useUserContext from './useUserContext';

const useRecipes = () => {
  const [recipes, setRecipes] = useState<DatabaseRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useUserContext();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('/api/recipes');
        const data: DatabaseRecipe[] = await response.json();

        // Show all user recipes + public ones from others
        const filteredRecipes = data.filter(
          recipe => recipe.user._id === currentUser._id || recipe.privacyPublic,
        );

        setRecipes(filteredRecipes);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [currentUser]);

  return { recipes, loading };
};

export default useRecipes;
