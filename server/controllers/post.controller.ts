import express, { Request, Response } from 'express';
import { AddPostRequest, FakeSOSocket, PopulatedDatabasePost, Posts, Recipe, UserByUsernameRequest } from '../types/types';
import { getFollowingPostList, getPostList, savePost } from '../services/post.service';
import { saveRecipe } from '../services/recipe.service';
import { processRecipeTags, processTags } from '../services/tag.service';
import RecipeModel from '../models/recipe.models';
import TagModel from '../models/tags.model';

const postController = (socket: FakeSOSocket) => {
  const router = express.Router();
  /**
   * Adds a new post to the database. The post is first validated and then saved.
   * If the tags are invalid or saving the post fails, the HTTP response status is updated.
   *
   * @param req The AddPostRequest object containing the post data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const addPost = async (req: AddPostRequest, res: Response): Promise<void> => {
    const post: Posts = req.body; // Destructure the post fields from the request body
    try {
      const tagIds = await Promise.all(
        post.recipe.tags.map(async (tagName: string) => {
          let tag = await TagModel.findOne({ name: tagName });
          if (!tag) {
            tag = new TagModel({ 
              name: tagName,
              description: '',
            });
            await tag.save();
          }

          return tag._id;
        })
      );

      const recipeWithTags = {
        ...post.recipe,
        tags: tagIds,
      };

      const savedPost = await savePost(post, recipeWithTags);
      if ('error' in savedPost) {
        throw new Error(savedPost.error); // Handle errors in saving the post
      }
      res.json(savedPost);
    } catch (err) {
      res.status(500).send(`Error when saving post: ${err instanceof Error ? err.message : err}`);
    }
  };

  /**
   * Retrieves all users from the database.
   * @param res The response, either returning the users or an error.
   * @returns A promise resolving to void.
   */
  const getPosts = async (_: Request, res: Response): Promise<void> => {
    try {
      const posts = await getPostList();
      posts
      if ('error' in posts) {
        throw Error('error posting');
      }

      res.status(200).json(posts);
    } catch (error) {
      res.status(500).send(`Error when getting Posts: ${error}`);
    }
  };

   /**
   * Retrieves all users from the database.
   * @param res The response, either returning the users or an error.
   * @returns A promise resolving to void.
   */
   const getFollowingPosts = async (req: UserByUsernameRequest, res: Response): Promise<void> => {
    try {
      const { username } = req.params;
      const users = await getFollowingPostList(username);

      if ('error' in users) {
        throw Error('error posting');
      }

      res.status(200).json(users);
    } catch (error) {
      res.status(500).send(`Error when getting posts from users that you follow: ${error}`);
    }
  };

  router.post('/addPost', addPost);
  router.get('/getPosts', getPosts);
  router.get('/getFollowingPosts', getFollowingPosts);
  
  return router;
};
export default postController;
