import express, { Request, Response } from 'express';
import {
  AddPostRequest,
  DatabaseRecipe,
  FakeSOSocket,
  Posts,
  RecipeForPost,
  UpdateLikesRequest,
  UserByUsernameRequest,
} from '../types/types';
import { getFollowingPostList, getPostList, likePost, savePost } from '../services/post.service';
import { createRecipe } from '../services/recipe.service';
import { processTags } from '../services/tag.service';
import PostModel from '../models/posts.model';

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
      // const tagIds = await Promise.all(
      //   post.recipe.tags.map(async (tagObject: { name: string; description: string }) => {
      //     let tag = await TagModel.findOne({ name: tagObject.name });
      //     if (!tag) {
      //       tag = new TagModel({
      //         name: tagObject.name,
      //         description: tagObject.description || '',
      //       });
      //       await tag.save();
      //     }
      //     return tag._id;
      //   })
      // );

      const recipeWithTags: RecipeForPost = {
        ...post.recipe,
        tags: await processTags(post.recipe.tags),
      };

      // const recipeWithTags: DatabaseRecipe = {
      //   ...post.recipe,
      //   tags: tagIds,
      // };

      const savedRecipe = (await createRecipe(recipeWithTags)) as DatabaseRecipe;

      if ('error' in savedRecipe) {
        throw new Error('Cannot save recipe');
      }

      const newPost: Posts = {
        username: post.username,
        recipe: savedRecipe._id,
        text: post.text,
        datePosted: post.datePosted,
        likes: post.likes,
        saves: post.saves,
      };

      const savedPost = await savePost(newPost);
      if ('error' in savedPost) {
        throw new Error(savedPost.error);
      }

      const populatedPost = await PostModel.findById(savedPost._id).populate('recipe');

      if (!populatedPost) {
        throw new Error('Post not found after saving');
      }

      socket.emit('postUpdate', populatedPost);
      res.json(populatedPost);
    } catch (error) {
      res.status(500).send(`Error when saving post: ${error}`);
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
      if ('error' in posts) {
        throw Error('Error getting posts');
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

  /**
   * Updates number of likes on a post.
   * @param res The response, either returning the updated post or an error.
   * @returns A promise resolving to void.
   */
  const updatePostLikes = async (req: UpdateLikesRequest, res: Response): Promise<void> => {
    try {
      if (!req.body.postID || !req.body.username) {
        throw Error('PostID and Username required');
      }

      const result = await likePost(req.body.postID, req.body.username);

      if ('error' in result) {
        throw new Error(result.error);
      }

      res.status(200).json(result);
    } catch (error) {
      res.status(500).send(`Error when updating post likes: ${error}`);
    }
  };

  router.post('/addPost', addPost);
  router.get('/getPosts', getPosts);
  router.get('/getFollowingPosts/:username', getFollowingPosts);

  router.patch('/updatePostLikes', updatePostLikes);

  return router;
};
export default postController;
