import { ObjectId } from 'mongodb';
import PostModel from '../models/posts.model';
import RecipeModel from '../models/recipe.models';
import TagModel from '../models/tags.model';
import UserModel from '../models/users.model';
import {
  DatabasePost,
  PostResponse,
  PopulatedDatabasePost,
  DatabaseRecipe,
  Posts,
} from '../types/types';
import { getUserByUsername } from './user.service';

/**
 * Saves a new post to the database.
 * @param {Partial<Posts>} post - The post to save, including username, recipe, text, video, etc.
 * @returns {Promise<PostResponse>} - The saved post or error message
 */
export const savePost = async (post: Posts): Promise<PostResponse> => {
  try {
    const result: DatabasePost = await PostModel.create(post);
    await UserModel.findOneAndUpdate(
      { username: result.username },
      { $push: { postsCreated: result } },
      { new: true },
    );

    return result;
  } catch (error) {
    throw new Error(`Post could not be saved: ${error}`);
  }
};

/**
 * Retrieves all posts from the database and populates the recipe field.
 * @returns {Promise<PopulatedDatabasePost[]>} - Resolves with the populated post objects or an error message.
 */
export const getPostList = async (): Promise<PopulatedDatabasePost[]> => {
  try {
    const posts = await PostModel.find()
      .populate<{ recipe: DatabaseRecipe }>([
        {
          path: 'recipe',
          model: RecipeModel,
          populate: { path: 'tags', model: TagModel },
        },
      ])
      .sort({ createdAt: -1 });

    if (!posts) {
      throw Error('Posts could not be retrieved');
    }

    const publicPosts = await Promise.all(
      posts.map(async post => {
        const user = await UserModel.findOne({ username: post.username }).lean();
        return user && user.privacySetting !== 'Private' ? post : null;
      })
    );

    // Remove null values directly in filter()
    return publicPosts.filter(post => post !== null);
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
    const user = await getUserByUsername(username);

    if ('error' in user) {
      throw new Error('User not found');
    }

    const followingUserIds = [...user.following, username];
   

    // Find posts only from users that the logged-in user follows
    const posts = await PostModel.find({ username: { $in: followingUserIds } })
      .populate<{ recipe: DatabaseRecipe }>([
        {
          path: 'recipe',
          model: RecipeModel,
          populate: { path: 'tags', model: TagModel },
        },
      ])
      .sort({ createdAt: -1 });

    if (!posts) {
      throw new Error('Posts could not be retrieved');
    }

    return posts;
  } catch (error) {
    throw new Error(`Posts could not be retrieved: ${error}`);
  }
};

/**
 * Updates post information in the database.
 *
 * @param {ObjectId} postID - The ID of the post to update.
 * @param {string} usernmae - Username of user who liked the post.
 * @returns {Promise<PostResponse>} - Resolves with the updated post or an error message.
 */
export const likePost = async (postID: ObjectId, username: string): Promise<PostResponse> => {
  try {
    const post = await PostModel.findById(postID);

    if (!post) {
      throw Error('Post not found');
    }

    const isLiked = post.likes.includes(username);

    const updatedPost = await PostModel.findOneAndUpdate(
      { _id: postID },
      isLiked ? { $pull: { likes: username } } : { $addToSet: { likes: username } },
      { new: true },
    );

    if (!updatedPost) {
      throw new Error('Failed to update likes');
    }

    return updatedPost;
  } catch (error) {
    return { error: `Error occurred when updating post: ${error}` };
  }
};
