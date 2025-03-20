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

// const recipes: PopulatedDatabaseRecipe | null = await RecipeModel.find({
//   user: user._id,
// }).populate<{
//   tags: DatabaseTag[];
//   user: DatabaseUser[];
// }>([
//   { path: 'tags', model: TagModel },
//   { path: 'user', model: UserModel },
// ]);

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
 * Retrieves a user from the database by their username.
 *
 * @param {string} username - The username of the user to find.
 * @returns {Promise<RecipeResponse>} - Resolves with the found user object (without the password) or an error message.
 */
export const getRecipesByUsername = async (username: string) => {
  try {
    // const user = await UserModel.findOne({ username });
    const user: SafeDatabaseUser | null = await UserModel.findOne({ username }).select('-password');

    if (!user) {
      throw new Error('User not found');
    }

    const recipes = await RecipeModel.find({ user: user._id });
    // return user;
    return recipes;
  } catch (error) {
    return { error: `Error occurred when finding recipes: ${error}` };
  }
};

// /**
//  * Retrieves a user from the database by their username.
//  *
//  * @param {string} username - The username of the user to find.
//  * @returns {Promise<RecipeResponse>} - Resolves with the found user object (without the password) or an error message.
//  */
// export const filterRecipeByUsername = async (
//   username: string,
// ): Promise<PopulatedDatabaseRecipe[]> => {
//   try {
//     // const user = await UserModel.findOne({ username });
//     const user: SafeDatabaseUser | null = await UserModel.findOne({ username })
//       .select('-password')
//       .lean();

//     if (!user) {
//       throw new Error('User not found');
//     }

//     const recipes = await RecipeModel.find({ user: user._id });
//     // return user;
//     return recipes;
//   } catch (error) {
//     return { error: `Error occurred when finding recipes: ${error}` };
//   }
// };

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

    // if (searchTags.length === 0) {
    //   return checkKeywordInQuestion(q, searchKeyword);
    // }

    return checkTagInRecipe(r, searchTags);
    // checkKeywordInQuestion(q, searchKeyword) ||
  });
};

/**
 * Create a new recipe
 * @param {Recipe} recipeData - The data to be provided to create a recipe in the database
 * @returns {Promise<Recipe>} - Promise for a new recipe to be created
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
 * Create a new calendar recipe
 * @param {RecipeCalendarEvent} recipeData - The data to be provided to create a calendar recipe in the database
 * @returns {Promise<Recipe>} - Promise for a new recipe to be created
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
 * Retrieves a recipe from the database by the ID.
 *
 * @param {string} recipeID - The username of the user to find.
 * @returns {Promise<UserResponse>} - Resolves with the found user object (without the password) or an error message.
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
