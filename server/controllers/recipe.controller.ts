import express, { Request, Response } from 'express';
import { getRecipesByUsername, saveRecipe } from '../services/recipe.service';
import { AddRecipeRequest, FakeSOSocket } from '../types/types';

const recipeController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Retrieves a recipe by the username of the user.
   * @param req The request containing the username as a route parameter.
   * @param res The response, either returning the recipes or an error.
   * @returns A promise resolving to void.
   */
  const addRecipe = async (req: AddRecipeRequest, res: Response): Promise<void> => {
    try {
      const recipes = await saveRecipe(req.body);
      res.status(200).json(recipes);
    } catch (error) {
      res.status(500).json({ message: error || 'Error adding recipes' });
    }
  };

  /**
   * Retrieves a recipe by the username of the user.
   * @param req The request containing the username as a route parameter.
   * @param res The response, either returning the recipes or an error.
   * @returns A promise resolving to void.
   */
  const getRecipes = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username } = req.params;
      const recipes = await getRecipesByUsername(username);
      res.status(200).json(recipes);
    } catch (error) {
      res.status(500).json({ message: error || 'Error fetching recipes' });
    }
  };

  /**
   * Retrieves a list of questions filtered by a search term and ordered by a specified criterion.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The FindQuestionRequest object containing the query parameters `order` and `search`.
   * @param res The HTTP response object used to send back the filtered list of questions.
   *
   * @returns A Promise that resolves to void.
   */
  // const getRecipesByFilter = async (req: FindRecipeRequest, res: Response): Promise<void> => {
  //   const { username } = req.params;
  //   const { search } = req.query;

  //   try {
  //     // let qlist = qlist.filter(q => q.user.username === askedBy);
  //     // const rlist: Recipe[] = await getRecipeByUsername(username);

  //     // Filter by search keyword and tags
  //     const resqlist: PopulatedDatabaseRecipe[] = filterRecipeBySearch(rlist, search);

  //     res.json(resqlist);
  //   } catch (err: unknown) {
  //     if (err instanceof Error) {
  //       res.status(500).send(`Error when fetching questions by filter: ${err.message}`);
  //     } else {
  //       res.status(500).send(`Error when fetching questions by filter`);
  //     }
  //   }
  // };

  router.get('/getrecipes/:username', getRecipes);
  router.post('/addRecipe', addRecipe);

  return router;
};
export default recipeController;
