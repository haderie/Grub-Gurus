import { ObjectId } from 'mongodb';
import RecipeModel from '../models/recipe.models';
import UserModel from '../models/users.model';
import {
  SafeDatabaseUser,
  Recipe,
  PopulatedDatabaseRecipe,
  DatabaseRecipe,
  RecipeResponse,
  RecipeCalendarEvent,
} from '../types/types';
import { parseKeyword, parseTags } from '../utils/parse.util';
import { checkTagInRecipe } from './tag.service';

/**
 * Filters questions by the user who asked them.
 * @param {PopulatedDatabaseQuestion[]} qlist - The list of questions
 * @param {string} askedBy - The username to filter by
 * @returns {PopulatedDatabaseQuestion[]} - Filtered questions
 */
export const filterQuestionsByAskedBy = (
  qlist: PopulatedDatabaseRecipe[],
  askedBy: string,
): PopulatedDatabaseRecipe[] => qlist.filter(q => q.user.username === askedBy);

/**
 * Retrieves recipes from the database by whoever created them (given a username).
 *
 * @param {string} username - The username of the user to find.
 * @returns {Promise<RecipeResponse>} - Resolves with the found recipe objects or an error message.
 */
export const getRecipesByUsername = async (username: string) => {
  try {
    const user: SafeDatabaseUser | null = await UserModel.findOne({ username }).select('-password');

    if (!user) {
      throw new Error('User not found');
    }

    const recipes = await RecipeModel.find({ user: user._id });
    return recipes;
  } catch (error) {
    return { error: `Error occurred when finding recipes: ${error}` };
  }
};

/**
 * Filters questions by search string containing tags and/or keywords.
 * @param {PopulatedDatabaseRecipe[]} qlist - The list of recipes
 * @param {string} search - The search string
 * @returns {PopulatedDatabaseRecipe[]} - Filtered list of recipe
 */
export const filterRecipeBySearch = (
  rlist: PopulatedDatabaseRecipe[],
  search: string,
): PopulatedDatabaseRecipe[] => {
  const searchTags = parseTags(search);
  const searchKeyword = parseKeyword(search);

  return rlist.filter((r: Recipe) => {
    if (searchKeyword.length === 0 && searchTags.length === 0) {
      return true;
    }

    if (searchKeyword.length === 0) {
      return checkTagInRecipe(r, searchTags);
    }

    return checkTagInRecipe(r, searchTags);
  });
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
      throw Error('Failed to create recipe');
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
    const recipe: DatabaseRecipe | null = await RecipeModel.findOne({ recipeID });

    if (!recipe) {
      throw Error('Recipe not found');
    }

    return recipe;
  } catch (error) {
    return { error: `Error occurred when finding recipe: ${error}` };
  }
};
