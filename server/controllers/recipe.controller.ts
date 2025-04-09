import express, { Request, Response } from 'express';
import {
  getRecipesByUsername,
  createRecipe,
  createCalendarRecipe,
  updateRecipeToCalendarRecipe,
} from '../services/recipe.service';
import {
  AddCalendarRecipeRequest,
  AddRecipeRequest,
  FakeSOSocket,
  Recipe,
  UpdateCalendarRecipeRequest,
} from '../types/types';
import { populateDocument } from '../utils/database.util';
import { processTags } from '../services/tag.service';

const recipeController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Validates that the request body for creating or updating a recipe contains all required fields.
   * @param recipe The recipe object to validate.
   * @returns `true` if the recipe contains all required fields; otherwise, `false`.
   */
  const isRecipeRequestBodyValid = (recipe: Recipe): boolean =>
    recipe.user !== undefined &&
    recipe.title !== undefined &&
    recipe.privacyPublic !== undefined &&
    recipe.ingredients !== undefined &&
    recipe.description !== undefined &&
    recipe.instructions !== undefined &&
    recipe.cookTime !== undefined;

  /**
   * Validates that the request body for updating a calendar recipe contains all required fields.
   * @param request The request object containing the recipe update data.
   * @returns `true` if the update request contains all required fields; otherwise, `false`.
   */
  const isRecipeUpdateRequestBodyValid = (request: UpdateCalendarRecipeRequest): boolean =>
    request.body.recipeID !== undefined &&
    request.body.addedToCalendar !== undefined &&
    request.body.start !== undefined &&
    request.body.end !== undefined &&
    request.body.color !== undefined;

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
   * Handles the creation of a new recipe.
   * @param req The request containing recipe in the body.
   * @param res The response, either returning the created recipe or an error.
   * @returns A promise resolving to void.
   */
  const addRecipe = async (req: AddRecipeRequest, res: Response): Promise<void> => {
    if (!isRecipeRequestBodyValid(req.body)) {
      res.status(400).send('Invalid recipe body');
      return;
    }

    const recipe: Recipe = req.body; // Destructure the post fields from the request body
    try {
      const recipeWithTags = {
        ...recipe,
        tags: await processTags(recipe.tags),
      };

      const result = await createRecipe(recipeWithTags);

      if ('error' in result) {
        throw new Error(result.error);
      }

      const populatedRecipe = await populateDocument(result._id.toString(), 'recipe');

      if ('error' in result) {
        throw new Error('Error adding recipe');
      }

      res.status(200).json(populatedRecipe);
    } catch (error) {
      res.status(500).send(`Error when saving recipe: ${error}`);
    }
  };

  /**
   * Handles the creation of a new calendar recipe.
   * @param req The request containing calendar recipe in the body.
   * @param res The response, either returning the created calendar or an error.
   * @returns A promise resolving to void.
   */
  const addCalendarRecipe = async (req: AddCalendarRecipeRequest, res: Response): Promise<void> => {
    if (!isRecipeRequestBodyValid(req.body)) {
      res.status(400).send('Invalid recipe body');
      return;
    }

    try {
      const result = await createCalendarRecipe(req.body);

      if ('error' in result) {
        throw new Error(result.error);
      }

      res.status(200).json(result);
    } catch (error) {
      res.status(500).send(`Error when adding recipe to calendar: ${error}`);
    }
  };

  /**
   * Updates a recipe's details in the calendar.
   * This function validates the request body, checks if all required fields are present,
   * and then attempts to update the recipe on the calendar. If successful, it returns the updated recipe details.
   * If there is an error, it sends an appropriate error response.
   *
   * @param req The incoming request containing the recipe update data.
   * @param res The response object, used to send back the result or error.
   * @returns A promise resolving to void.
   */
  const updateRecipeForCalendar = async (
    req: UpdateCalendarRecipeRequest,
    res: Response,
  ): Promise<void> => {
    if (!isRecipeUpdateRequestBodyValid(req)) {
      res.status(400).send('Invalid recipe body');
      return;
    }

    try {
      const result = await updateRecipeToCalendarRecipe(req.body.recipeID, req.body);

      if ('error' in result) {
        throw new Error(result.error);
      }

      res.status(200).json(result);
    } catch (error) {
      res.status(500).send(`Error when updating recipe: ${error}`);
    }
  };

  router.get('/getRecipes/:username', getRecipes);
  router.post('/addRecipe', addRecipe);
  router.post('/addCalendarRecipe', addCalendarRecipe);
  router.patch('/updateRecipeForCalendar', updateRecipeForCalendar);

  return router;
};
export default recipeController;
