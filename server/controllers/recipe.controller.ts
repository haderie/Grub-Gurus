import express, { Request, Response } from 'express';
import { getRecipeByUsername } from '../services/recipe.service';
import {
  DatabaseRecipe,
  RecipeByUsernameRequest,
  FakeSOSocket,
  UserByUsernameRequest,
} from '../types/types';
import { getUserByUsername } from '../services/user.service';

const recipeController = (socket: FakeSOSocket) => {
  const router = express.Router();

  // Get recipes by username
  const getRecipe = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username } = req.params;
      const recipes = await getRecipeByUsername(username);
      res.status(200).json(recipes);
    } catch (error) {
      res.status(500).json({ message: error || 'Error fetching recipes' });
    }
  };

  router.get('/getrecipe/:username', getRecipe);

  return router;
};
export default recipeController;
