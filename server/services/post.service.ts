import PostModel from '../models/posts.model';
import RecipeModel from '../models/recipe.models';
import { DatabasePost, PostResponse, PopulatedDatabasePost, DatabaseRecipe } from '../types/types';
import { getUserByUsername } from './user.service';

/**
 * Saves a new question to the database.
 * @param {Post} post - The question to save
 * @returns {Promise<PostResponse>} - The saved question or error message
 */
// eslint-disable-next-line import/prefer-default-export
export const savePost = async (recipe: DatabaseRecipe): Promise<PostResponse> => {
  try {
    const result: DatabasePost = await PostModel.create({ recipe });

    return result;
  } catch (error) {
    return { error: 'Error when saving a post' };
  }
};

/**
 * Retrieves all users from the database.
 * Users documents are returned in the order in which they were created, oldest to newest.
 *
 * @returns {Promise<UsersResponse>} - Resolves with the found user objects (without the passwords) or an error message.
 */
export const getPostList = async (): Promise<PopulatedDatabasePost[]> => {
  try {
    const posts = await PostModel.find().populate<{
      recipe: DatabaseRecipe;
    }>([{ path: 'recipe', model: RecipeModel }]).sort({createdAt: -1});

    if (!posts) {
      throw Error('Posts could not be retrieved');
    }

    return posts;
  } catch (error) {
    throw Error(`Posts could not be retrieved ${error}`);
  }
};

/**
 * Retrieves all users from the database.
 * Users documents are returned in the order in which they were created, oldest to newest.
 *
 * @returns {Promise<UsersResponse>} - Resolves with the found user objects (without the passwords) or an error message.
 */
export const getFollowingPostList = async (username: string): Promise<PopulatedDatabasePost[]> => {
  try {
    // Fetch the logged-in user's data to get the list of users they follow
    const user = await getUserByUsername(username);

    if ('error' in user) {
      throw new Error('User not found');
    }

    const followingUserIds = user.following; // Assuming `following` is an array of user IDs that the logged-in user follows

    // Find posts only from users that the logged-in user follows
    const posts = await PostModel.find({ username: { $in: followingUserIds } })
      .populate<{ recipe: DatabaseRecipe }>([{ path: 'recipe', model: RecipeModel }])
      .sort({ createdAt: -1 }); // Optionally, you can add sorting here

    if (!posts) {
      throw new Error('Posts could not be retrieved');
    }

    return posts;
  } catch (error) {
    throw new Error(`Posts could not be retrieved: ${error}`);
  }
};
