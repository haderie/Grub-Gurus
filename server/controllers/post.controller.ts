import express, { Request, Response } from 'express';
import { FakeSOSocket, PopulatedDatabasePost, Posts } from '../types/types';
import { getPostList, savePost } from '../services/post.service';
import { populateDocument } from '../utils/database.util';
import { saveRecipe } from '../services/recipe.service';
import { processTags } from '../services/tag.service';

const postController = (socket: FakeSOSocket) => {
  const router = express.Router();
  /**
   * Adds a new question to the database. The question is first validated and then saved.
   * If the tags are invalid or saving the question fails, the HTTP response status is updated.
   *
   * @param req The AddQuestionRequest object containing the question data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const addPost = async (req: Request, res: Response): Promise<void> => {
    try {
      const recipe = req.body; // Expecting a single recipe object

      const recipeWithTags = {
        ...recipe,
        tags: await processTags(recipe.tags),
      };

      // if (recipeWithTags.tags.length === 0) {
      //   throw new Error('Invalid tags');
      // }

      // Save the recipe first
      const savedRecipe = await saveRecipe(recipeWithTags);

      if ('error' in savedRecipe) {
        throw new Error(savedRecipe.error);
      }

      // Save the post with the single recipe
      const result = await savePost(savedRecipe);

      if ('error' in result) {
        throw new Error(result.error);
      }

      // Populate the new post
      const populatedPost = await populateDocument(result._id.toString(), 'post');

      if ('error' in populatedPost) {
        throw new Error(populatedPost.error);
      }

      socket.emit('postUpdate', populatedPost as PopulatedDatabasePost);
      res.json(populatedPost);
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
      const users = await getPostList();

      if ('error' in users) {
        throw Error('error posting');
      }

      res.status(200).json(users);
    } catch (error) {
      res.status(500).send(`Error when getting Posts: ${error}`);
    }
  };

  router.post('/addPost', addPost);
  router.get('/getPosts', getPosts);

  return router;
};
export default postController;
