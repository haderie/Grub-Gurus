import PostModel from '../models/posts.model';
import RecipeModel from '../models/recipe.models';
import UserModel from '../models/users.model';
import { DatabasePost, PostResponse, PopulatedDatabasePost, DatabaseRecipe, Posts } from '../types/types';
import { getUserByUsername } from './user.service';

/**
 * Saves a new post to the database.
 * @param {Posts} post - The post to save, including username, recipe, text, video, etc.
 * @returns {Promise<PostResponse>} - The saved post or error message
 */
export const savePost = async (post: Posts): Promise<PostResponse> => {
  try {
    const result: DatabasePost = await PostModel.create(post);
    await UserModel.findByIdAndUpdate(result.username, {
      $push: { postsCreated: result }, 
    });
    return result;
  } catch (error) {
    return { error: 'Error when saving a post' };
  }
};

/**
 * Retrieves all posts from the database and populates the recipe field.
 * @returns {Promise<PopulatedDatabasePost[]>} - Resolves with the populated post objects or an error message.
 */
export const getPostList = async (): Promise<PopulatedDatabasePost[]> => {
  try {
    const posts = await PostModel.find()
      .populate<{ recipe: DatabaseRecipe }>([{ path: 'recipe', model: RecipeModel }])
      .sort({ createdAt: -1 });

    if (!posts) {
      throw Error('Posts could not be retrieved');
    }

    return posts;
  } catch (error) {
    throw new Error(`Posts could not be retrieved: ${error}`);
  }
};


/**
 * Retrieves posts from users that the logged-in user follows.
 * @param username The logged-in user's username.
 * @returns {Promise<PopulatedDatabasePost[]>} - Resolves with the populated posts from followed users.
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
