import { ObjectId } from 'mongodb';
import RecipeModel from '../models/recipe.models';
import UserModel from '../models/users.model';
import {
  Recipe,
  DatabaseRecipe,
  RecipeResponse,
  RecipeCalendarEvent,
  SafePopulatedDatabaseUser,
} from '../types/types';

// /**

/**
 * Retrieves recipes from the database by whoever created them (given a username).
 *
 * @param {string} username - The username of the user to find.
 * @returns {Promise<PopulatedDatabaseRecipe>} - Resolves with the found recipe objects or an error message.
 */
export const getRecipesByUsername = async (username: string) => {
  try {
    const user: SafePopulatedDatabaseUser | null = await UserModel.findOne({ username }).select(
      '-password',
    );

    if (!user) {
      throw new Error('User not found');
    }

    const recipes = await RecipeModel.find({ user: user._id }).lean();
    return recipes;
  } catch (error) {
    return { error: `Error occurred when finding recipes: ${error}` };
  }
};

/**
 * Create a new recipe.
 * @param {Recipe} recipeData - The data to be provided to create a recipe in the database
 * @returns {Promise<RecipeResponse>} - Promise for a new recipe to be created
 */
export const createRecipe = async (recipeData: Recipe): Promise<RecipeResponse> => {
  try {
    const result: DatabaseRecipe = await RecipeModel.create(recipeData);

    if (!result) {
      throw Error('Failed to create recipe');
    }
    return result;
  } catch (error) {
    return { error: `Error occurred when saving recipe: ${error}` };
  }
};

/**
 * Create a new calendar recipe.
 * @param {RecipeCalendarEvent} recipeData - The data to be provided to create a calendar recipe in the database
 * @returns {Promise<RecipeResponse>} - Promise for a new recipe to be created
 */
export const createCalendarRecipe = async (
  recipeData: RecipeCalendarEvent,
): Promise<RecipeResponse> => {
  try {
    const result: DatabaseRecipe = await RecipeModel.create(recipeData);

    if (!result) {
      throw Error('Failed to create recipe in calendar');
    }
    return result;
  } catch (error) {
    return { error: `Error occurred when saving recipe: ${error}` };
  }
};

/**
 * Updates a recipe with calendar data (e.g., start date, end date, color) in the database.
 * This function takes a recipe ID and calendar data, then updates the recipe's corresponding calendar information
 * in the database. If the update is successful, it returns the updated recipe; otherwise, it throws an error.
 *
 * @param recipeID The unique identifier of the recipe to be updated.
 * @param calendarData The calendar-related data to update in the recipe, which is a partial object of RecipeCalendarEvent.
 * @returns {Promise<RecipeResponse>} - A promise that resolves to the updated recipe, or an error response if the update fails.
 */
export const updateRecipeToCalendarRecipe = async (
  recipeID: ObjectId,
  calendarData: Partial<RecipeCalendarEvent>,
): Promise<RecipeResponse> => {
  try {
    const updatedRecipe: DatabaseRecipe | null = await RecipeModel.findOneAndUpdate(
      { _id: recipeID },
      { $set: calendarData },
      { new: true },
    );

    if (!updatedRecipe) {
      throw new Error('Recipe not found or update failed');
    }

    return updatedRecipe;
  } catch (error) {
    return { error: `Error occurred when updating recipe: ${error}` };
  }
};

/**
 * Retrieves a recipe from the database by the ID.
 *
 * @param {string} recipeID - The username of the user to find.
 * @returns {Promise<RecipeResponse>} - Resolves with the found recipe object or an error message.
 */
export const getRecipeByID = async (recipeID: string): Promise<RecipeResponse> => {
  try {
    const recipe: DatabaseRecipe | null = await RecipeModel.findOne({ recipeID }).lean();

    if (!recipe) {
      throw Error('Recipe not found');
    }

    return recipe;
  } catch (error) {
    return { error: `Error occurred when finding recipe: ${error}` };
  }
};
