import axios from 'axios';
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

// /**
//  * Function to get questions by filter.
//  *
//  * @param order - The order in which to fetch questions. Default is 'newest'.
//  * @param search - The search term to filter questions. Default is an empty string.
//  * @throws Error if there is an issue fetching or filtering questions.
//  */
// const getRecipeByFilter = async (
//   order: string = 'newest',
//   search: string = '',
// ): Promise<PopulatedDatabaseRecipe[]> => {
//   const res = await api.get(`${RECIPE_API_URL}/getRecipe?order=${order}&search=${search}`);
//   if (res.status !== 200) {
//     throw new Error('Error when fetching or filtering questions');
//   }
//   return res.data;
// };

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
 * @param recipe - The recipe to be created.
 * @returns {Promise<Recipe>} The newly created recipe object.
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

export { getRecipesByUsername, addRecipe, addCalendarRecipe };
