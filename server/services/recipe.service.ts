import RecipeModel from '../models/recipe.models';
import UserModel from '../models/users.model';

import {
  DatabaseUser,
  SafeDatabaseUser,
  User,
  UserCredentials,
  UserResponse,
  UsersResponse,
  RecipeResponse,
  Recipe,
} from '../types/types';

/**
 * Retrieves a user from the database by their username.
 *
 * @param {string} username - The username of the user to find.
 * @returns {Promise<RecipeResponse>} - Resolves with the found user object (without the password) or an error message.
 */
export const getRecipeByUsername = async (username: string) => {
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

/// FILLER
/**
 * Retrieves all users from the database.
 * Users documents are returned in the order in which they were created, oldest to newest.
 *
 * @returns {Promise<UsersResponse>} - Resolves with the found user objects (without the passwords) or an error message.
 */
export const getUsersList = async (): Promise<UsersResponse> => {
  try {
    const users: SafeDatabaseUser[] = await RecipeModel.find().select('-password');

    if (!users) {
      throw Error('Users could not be retrieved');
    }

    return users;
  } catch (error) {
    throw Error(`Error occurred when finding user: ${error}`);
  }
};
