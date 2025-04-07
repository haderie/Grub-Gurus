import axios from 'axios';
import { ObjectId } from 'mongodb';
import api from './config';
import { PopulatedDatabaseRecipe, Recipe, RecipeCalendarEvent } from '../types/types';

const RECIPE_API_URL = `${process.env.REACT_APP_SERVER_URL}/recipe`;

/**
 * Function to get recipes by username
 *
 * @throws Error if there is an issue fetching users.
 */
const getRecipesByUsername = async (username: string) => {
  const res = await api.get(`${RECIPE_API_URL}/getRecipes/${username}`);
  if (res.status !== 200) {
    throw new Error('Error when fetching user');
  }
  return res.data;
};

// eslint-disable-next-line import/prefer-default-export

/**
 * Sends a POST request to create a new recipe.
 *
 * @param recipe - The recipe to be created.
 * @returns {Promise<Recipe>} The newly created recipe object.
 * @throws {Error} If an error occurs when creating a recipe.
 */
const addRecipe = async (recipe: Recipe): Promise<PopulatedDatabaseRecipe> => {
  try {
    const res = await api.post(`${RECIPE_API_URL}/addRecipe`, recipe);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(`Error while adding recipe: ${error.response.data}`);
    } else {
      throw new Error('Error while adding recipe');
    }
  }
};

/**
 * Sends a POST request to create a new calendar recipe.
 *
 * @param recipe - The calendar recipe to be created.
 * @returns {Promise<Recipe>} The newly created calendar recipe object.
 * @throws {Error} If an error occurs when creating a recipe.
 */
const addCalendarRecipe = async (recipe: RecipeCalendarEvent): Promise<PopulatedDatabaseRecipe> => {
  try {
    const res = await api.post(`${RECIPE_API_URL}/addRecipe`, recipe);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(`Error while adding recipe: ${error.response.data}`);
    } else {
      throw new Error('Error while adding recipe');
    }
  }
};

/**
 * Sends a PUT request to update an existing recipe to be a calendar recipe.
 *
 * @param recipeID - The ID of the recipe to update.
 * @param calendarData - The calendar-specific fields to be added.
 * @returns {Promise<PopulatedDatabaseRecipe>} - The updated recipe.
 * @throws {Error} If an error occurs when updating the recipe.
 */
const updateRecipeForCalendar = async (
  recipeID: ObjectId,
  addedToCalendar: boolean,
  start: Date,
  end: Date,
  color: string,
): Promise<PopulatedDatabaseRecipe> => {
  try {
    const res = await api.patch(`${RECIPE_API_URL}/updateRecipeForCalendar`, {
      recipeID,
      addedToCalendar,
      start,
      end,
      color,
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(`Error while updating recipe: ${error.response.data}`);
    } else {
      throw new Error('Error while updating recipe');
    }
  }
};

export { getRecipesByUsername, addRecipe, addCalendarRecipe, updateRecipeForCalendar };
