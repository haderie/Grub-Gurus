import PostModel from '../models/posts.model';
import RecipeModel from '../models/recipe.models';
import {
  DatabasePost,
  Posts,
  PostResponse,
  PostsResponse,
  PopulatedDatabasePost,
  DatabaseRecipe,
} from '../types/types';

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
    }>([{ path: 'recipe', model: RecipeModel }]);

    if (!posts) {
      throw Error('Posts could not be retrieved');
    }

    return posts;
  } catch (error) {
    throw Error(`Posts could not be retrieved ${error}`);
  }
};
