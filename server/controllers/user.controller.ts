import express, { Request, Response, Router } from 'express';
import {
  UserRequest,
  User,
  UserCredentials,
  UserByUsernameRequest,
  FakeSOSocket,
  UpdateBiographyRequest,
  UpdateFollowRequest,
  UpdatePrivacyRequest,
  UpdateRecipeBookPrivacy,
  SafePopulatedDatabaseUser,
  UpdatePosts,
} from '../types/types';
import {
  deleteUserByUsername,
  followUserService,
  getUserByUsername,
  getUsersList,
  loginUser,
  saveUser,
  unfollowUserService,
  updateRecipeRanking,
  updateUser,
} from '../services/user.service';
import PostModel from '../models/posts.model';

const userController = (socket: FakeSOSocket) => {
  const router: Router = express.Router();

  /**
   * Validates that the request body contains all required fields for a user.
   * @param req The incoming request containing user data.
   * @returns `true` if the body contains valid user fields; otherwise, `false`.
   */
  const isUserBodyValid = (req: UserRequest): boolean =>
    req.body !== undefined &&
    req.body.username !== undefined &&
    req.body.username !== '' &&
    req.body.password !== undefined &&
    req.body.password !== '';

  /**
   * Validates that the request body contains all required fields to update a biography.
   * @param req The incoming request containing user data.
   * @returns `true` if the body contains valid user fields; otherwise, `false`.
   */
  const isUpdateBiographyBodyValid = (req: UpdateBiographyRequest): boolean =>
    req.body !== undefined &&
    req.body.username !== undefined &&
    req.body.username.trim() !== '' &&
    req.body.biography !== undefined;

  /**
   * Validates that the request body contains all required fields to update the user privacy setting.
   * @param req The incoming request containing user data.
   * @returns `true` if the body contains valid user fields; otherwise, `false`.
   */
  const isUpdatePrivacyRequestValid = (req: UpdatePrivacyRequest): boolean =>
    req.body !== undefined &&
    req.body.username !== undefined &&
    req.body.username.trim() !== '' &&
    req.body.privacySetting !== undefined &&
    (req.body.privacySetting === 'Private' || req.body.privacySetting === 'Public');

  /**
   * Handles the creation of a new user account.
   * @param req The request containing username, email, and password in the body.
   * @param res The response, either returning the created user or an error.
   * @returns A promise resolving to void.
   */
  const createUser = async (req: UserRequest, res: Response): Promise<void> => {
    if (!isUserBodyValid(req)) {
      res.status(400).send('Invalid user body');
      return;
    }

    const requestUser = req.body;

    const user: User = {
      ...requestUser,
      dateJoined: new Date(),
      biography: requestUser.biography ?? '',
      followers: requestUser.followers ?? [],
      following: requestUser.following ?? [],
      privacySetting: 'Public',
      certified: requestUser.certified ?? false,
      recipeBookPublic: requestUser.recipeBookPublic ?? false,
      rankings: requestUser.rankings,
    };

    try {
      const result = await saveUser(user);

      if ('error' in result) {
        throw new Error(result.error);
      }

      socket.emit('userUpdate', {
        user: result,
        type: 'created',
      });
      res.status(200).json(result);
    } catch (error) {
      res.status(500).send(`Error when saving user: ${error}`);
    }
  };

  /**
   * Handles user login by validating credentials.
   * @param req The request containing username and password in the body.
   * @param res The response, either returning the user or an error.
   * @returns A promise resolving to void.
   */
  const userLogin = async (req: UserRequest, res: Response): Promise<void> => {
    try {
      if (!isUserBodyValid(req)) {
        res.status(400).send('Invalid user body');
        return;
      }

      const loginCredentials: UserCredentials = {
        username: req.body.username,
        password: req.body.password,
      };

      const user = await loginUser(loginCredentials);

      if ('error' in user) {
        throw Error(user.error);
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).send('Login failed');
    }
  };

  /**
   * Retrieves a user by their username.
   * @param req The request containing the username as a route parameter.
   * @param res The response, either returning the user or an error.
   * @returns A promise resolving to void.
   */
  const getUser = async (req: UserByUsernameRequest, res: Response): Promise<void> => {
    try {
      const { username } = req.params;

      const user = await getUserByUsername(username);

      if ('error' in user) {
        throw Error(user.error);
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).send(`Error when getting user by username: ${error}`);
    }
  };

  /**
   * Retrieves all users from the database.
   * @param res The response, either returning the users or an error.
   * @returns A promise resolving to void.
   */
  const getUsers = async (_: Request, res: Response): Promise<void> => {
    try {
      const users = await getUsersList();

      if ('error' in users) {
        throw Error(users.error);
      }

      res.status(200).json(users);
    } catch (error) {
      res.status(500).send(`Error when getting users: ${error}`);
    }
  };

  /**
   * Deletes a user by their username.
   * @param req The request containing the username as a route parameter.
   * @param res The response, either confirming deletion or returning an error.
   * @returns A promise resolving to void.
   */
  const deleteUser = async (req: UserByUsernameRequest, res: Response): Promise<void> => {
    try {
      const { username } = req.params;

      const deletedUser = await deleteUserByUsername(username);

      if ('error' in deletedUser) {
        throw Error(deletedUser.error);
      }

      socket.emit('userUpdate', {
        user: deletedUser,
        type: 'deleted',
      });
      res.status(200).json(deletedUser);
    } catch (error) {
      res.status(500).send(`Error when deleting user by username: ${error}`);
    }
  };

  /**
   * Resets a user's password.
   * @param req The request containing the username and new password in the body.
   * @param res The response, either confirming the update or returning an error.
   * @returns A promise resolving to void.
   */
  const resetPassword = async (req: UserRequest, res: Response): Promise<void> => {
    try {
      if (!isUserBodyValid(req)) {
        res.status(400).send('Invalid user body');
        return;
      }

      const updatedUser = await updateUser(req.body.username, { password: req.body.password });

      if ('error' in updatedUser) {
        throw Error(updatedUser.error);
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).send(`Error when updating user password: ${error}`);
    }
  };

  /**
   * Updates a user's biography.
   * @param req The request containing the username and biography in the body.
   * @param res The response, either confirming the update or returning an error.
   * @returns A promise resolving to void.
   */
  const updateBiography = async (req: UpdateBiographyRequest, res: Response): Promise<void> => {
    try {
      if (!isUpdateBiographyBodyValid(req)) {
        res.status(400).send('Invalid user body');
        return;
      }

      // Validate that request has username and biography
      const { username, biography } = req.body;

      // Call the same updateUser(...) service used by resetPassword
      const updatedUser = await updateUser(username, { biography });

      if ('error' in updatedUser) {
        throw new Error(updatedUser.error);
      }

      // Emit socket event for real-time updates
      socket.emit('userUpdate', {
        user: updatedUser,
        type: 'updated',
      });

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).send(`Error when updating user biography: ${error}`);
    }
  };

  /**
   * Updates a user's recipeBook privacy status.
   * @param req The request containing the username and recipeBookPublic boolean in the body.
   * @param res The response, either confirming the update or returning an error.
   * @returns A promise resolving to void.
   */
  const updateRecipeBookPrivacy = async (
    req: UpdateRecipeBookPrivacy,
    res: Response,
  ): Promise<void> => {
    try {
      // if (!isUpdateBiographyBodyValid(req)) {
      //   res.status(400).send('Invalid user body');
      //   return;
      // }

      // Validate that request has username and biography
      const { username, recipeBookPublic } = req.body;

      // Call the same updateUser(...) service used by resetPassword
      const updatedUser = await updateUser(username, { recipeBookPublic });

      if ('error' in updatedUser) {
        throw new Error(updatedUser.error);
      }

      // Emit socket event for real-time updates
      socket.emit('userUpdate', {
        user: updatedUser,
        type: 'updated',
      });

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).send(`Error when updating user recipeBook privacy status: ${error}`);
    }
  };

  /**
   * Updates a user's following list.
   * @param req The request containing the current user and new user to follow
   * @param res The response containing the updated following list for the current user and updated follower list for the user followed
   * @returns A promise resolving to void.
   */
  const updateFollowingList = async (req: UpdateFollowRequest, res: Response): Promise<void> => {
    try {
      const { username, usernameFollowed } = req.body;

      if (username === usernameFollowed) {
        throw Error('You cannot follow yourself');
      }

      const user = (await getUserByUsername(username)) as SafePopulatedDatabaseUser;

      let updatedUser;

      if (user.following?.includes(usernameFollowed)) {
        updatedUser = await unfollowUserService(username, usernameFollowed);
      } else {
        updatedUser = await followUserService(username, usernameFollowed);
      }

      if ('error' in updatedUser) {
        throw new Error(updatedUser.error);
      }

      // socket.emit('userUpdate', {
      //   user: updatedUser,
      //   type: 'updated',
      // });

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).send(`Error when following ${req.body.usernameFollowed}: ${error}`);
    }
  };

  /**
   * Updates a user's privacy setting.
   * @param req The request containing the username and privacy setting in the body.
   * @param res The response, either confirming the update or returning an error.
   * @returns A promise resolving to void.
   */
  const updatePrivacy = async (req: UpdatePrivacyRequest, res: Response): Promise<void> => {
    try {
      if (!isUpdatePrivacyRequestValid(req)) {
        res.status(400).send('Invalid user body');
        return;
      }

      const { username, privacySetting } = req.body;

      const updatedUser = await updateUser(username, { privacySetting });

      if ('error' in updatedUser) {
        throw new Error(updatedUser.error);
      }

      socket.emit('userUpdate', {
        user: updatedUser,
        type: 'updated',
      });

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).send(`Error when updating user privacy setting: ${error}`);
    }
  };

  /**
   * Saves or removes a post from the user's saves list.
   * @param req The request containing the username and postID in the body.
   * @param res The response, either confirming the update or returning an error.
   * @returns A promise resolving to void.
   */
  const savePosts = async (req: UpdatePosts, res: Response): Promise<void> => {
    try {
      const { username, postID, action } = req.body; // Assuming `action` is either 'save' or 'remove'

      // Fetch the user
      const user = (await getUserByUsername(username)) as SafePopulatedDatabaseUser;

      if (!user) {
        res.status(404).send('User not found');
        return;
      }

      const post = await PostModel.findById(postID);

      if (!post) {
        res.status(404).send('Post not found');
        return;
      }

      // Check if the user is saving or removing the post
      if (action === 'save') {
        // Add post to the user's postsCreated if they are saving
        const updatedPosts = [...user.postsCreated, postID];
        await updateUser(username, {
          postsCreated: updatedPosts,
        });

        // Add the user to the post's saves list
        await PostModel.findOneAndUpdate(
          { _id: postID },
          { $addToSet: { saves: username } }, // Add user to saves list
          { new: true },
        );
      } else if (action === 'remove') {
        // Remove post from the user's postsCreated if they are removing
        // Remove post from the user's postsCreated if they are removing
        const updatedPosts = user.postsCreated.filter(p => p._id.toString() !== postID.toString());

        // Remove the ranking associated with the deleted post
        const removedRank = user.rankings.get(postID.toString());
        const updatedRankings = user.rankings;
        updatedRankings.delete(postID.toString());
        // delete user.rankings[postID.toString()];

        for (const [id, rank] of updatedRankings.entries()) {
          if (rank > removedRank) {
            updatedRankings.set(id, rank - 1);
          }
        }

        // Update user document with new posts and adjusted rankings
        await updateUser(username, {
          postsCreated: updatedPosts,
        });

        // Update user document with new posts and adjusted rankings
        await updateUser(username, {
          rankings: Object.fromEntries(updatedRankings),
        });

        // Remove the user from the post's saves list
        await PostModel.findOneAndUpdate(
          { _id: postID },
          { $pull: { saves: username } }, // Remove user from saves list
          { new: true },
        );
      } else {
        res.status(400).send('Invalid action');
        return;
      }

      res.status(200).json({ message: `Post ${action}d successfully.` });
    } catch (error) {
      res.status(500).send(`Error when saving or removing post: ${error}`);
    }
  };

  /**
   * Handles the ranking of a recipe by a user.
   * @param req The request containing username, recipeId, and ranking.
   * @param res The response confirming the update or returning an error.
   */
  const rankRecipe = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, postID, ranking } = req.body;

      if (!username || !postID || ranking === undefined) {
        res.status(400).send('Missing required fields.');
        return;
      }
      const user = (await getUserByUsername(username)) as SafePopulatedDatabaseUser;
      const updatedRankings = user.rankings;

      const oldRanking = updatedRankings.get(postID.toString()); // or wherever you're getting the rank
      updatedRankings.delete(postID.toString()); // or set to 0 if you prefer

      const updatedUser = await updateRecipeRanking(username, postID, ranking);

      if (ranking === 0) {
        for (const [id, rank] of updatedRankings.entries()) {
          if (rank >= oldRanking + 1) {
            updatedRankings.set(id, rank - 1);
          }
        }

        // Update user document with new posts and adjusted rankings
        const updatedRankUser = await updateUser(username, {
          rankings: Object.fromEntries(updatedRankings),
        });
        res.status(200).json(updatedRankUser);
        return;
      }

      if ('error' in updatedUser) {
        res.status(400).send(updatedUser.error);
        return;
      }
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).send(`Error ranking recipe: ${error}`);
    }
  };

  // Define routes for the user-related operations.
  router.post('/signup', createUser);
  router.post('/login', userLogin);
  router.patch('/resetPassword', resetPassword);
  router.get('/getUser/:username', getUser);
  router.get('/getUsers', getUsers);
  router.delete('/deleteUser/:username', deleteUser);
  router.patch('/updateBiography', updateBiography);
  router.patch('/updateRecipeBookPrivacy', updateRecipeBookPrivacy);
  router.patch('/followUser', updateFollowingList);
  router.patch('/updatePrivacy', updatePrivacy);
  router.patch('/savePost', savePosts);
  router.post('/rank-recipe', rankRecipe);

  return router;
};

export default userController;
