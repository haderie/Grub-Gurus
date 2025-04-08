import { ObjectId } from 'mongodb';
import PostModel from '../models/posts.model';
import RecipeModel from '../models/recipe.models';
import UserModel from '../models/users.model';
import {
  DatabasePost,
  DatabaseUser,
  PopulatedDatabasePost,
  SafeDatabaseUser,
  SafePopulatedDatabaseUser,
  User,
  UserCredentials,
  UserPopulatedResponse,
  UserResponse,
  UsersPopulatedResponse,
} from '../types/types';
import TagModel from '../models/tags.model';

/**
 * Saves a new user to the database.
 *
 * @param {User} user - The user object to be saved, containing user details like username, password, etc.
 * @returns {Promise<UserResponse>} - Resolves with the saved user object (without the password) or an error message.
 */
export const saveUser = async (user: User): Promise<UserResponse> => {
  try {
    const result: DatabaseUser = await UserModel.create(user);

    if (!result) {
      throw Error('Failed to create user');
    }

    // Remove password field from returned object
    const safeUser: SafeDatabaseUser = {
      _id: result._id,
      username: result.username,
      dateJoined: result.dateJoined,
      biography: result.biography,
      certified: result.certified,
      followers: result.followers,
      following: result.following,
      privacySetting: result.privacySetting,
      recipeBookPublic: result.recipeBookPublic,
      postsCreated: result.postsCreated,
      rankings: result.rankings,
    };

    return safeUser;
  } catch (error) {
    return { error: `Error occurred when saving user: ${error}` };
  }
};

/**
 * Retrieves a user from the database by their username.
 *
 * @param {string} username - The username of the user to find.
 * @returns {Promise<UserPopulatedResponse>} - Resolves with the found user object (without the password) or an error message.
 */
export const getUserByUsername = async (username: string): Promise<UserPopulatedResponse> => {
  try {
    const user: SafePopulatedDatabaseUser | null = await UserModel.findOne({ username })
      .select('-password')
      .populate<{ postsCreated: PopulatedDatabasePost[] }>([
        {
          path: 'postsCreated',
          model: PostModel,
          populate: {
            path: 'recipe',
            model: RecipeModel,
            populate: { path: 'tags', model: TagModel },
          },
        },
      ]);
    if (!user) {
      throw Error('User not found');
    }

    return user;
  } catch (error) {
    return { error: `Error occurred when finding user: ${error}` };
  }
};

/**
 * Retrieves all users from the database.
 * Users documents are returned in the order in which they were created, oldest to newest.
 *
 * @returns {Promise<UsersResponse>} - Resolves with the found user objects (without the passwords) or an error message.
 */
export const getUsersList = async (): Promise<UsersPopulatedResponse> => {
  try {
    const users: SafePopulatedDatabaseUser[] = await UserModel.find()
      .select('-password')
      .populate<{ postsCreated: DatabasePost[] }>([{ path: 'postsCreated', model: PostModel }]);
    if (!users) {
      throw Error('Users could not be retrieved');
    }

    return users;
  } catch (error) {
    return { error: `Error occurred when finding users: ${error}` };
  }
};

/**
 * Authenticates a user by verifying their username and password.
 *
 * @param {UserCredentials} loginCredentials - An object containing the username and password.
 * @returns {Promise<UserResponse>} - Resolves with the authenticated user object (without the password) or an error message.
 */
export const loginUser = async (loginCredentials: UserCredentials): Promise<UserResponse> => {
  const { username, password } = loginCredentials;

  try {
    const user: SafeDatabaseUser | null = await UserModel.findOne({ username, password }).select(
      '-password',
    );

    if (!user) {
      throw Error('Authentication failed');
    }

    return user;
  } catch (error) {
    return { error: `Error occurred when authenticating user: ${error}` };
  }
};

/**
 * Deletes a user from the database by their username.
 *
 * @param {string} username - The username of the user to delete.
 * @returns {Promise<UserResponse>} - Resolves with the deleted user object (without the password) or an error message.
 */
export const deleteUserByUsername = async (username: string): Promise<UserResponse> => {
  try {
    const deletedUser: SafeDatabaseUser | null = await UserModel.findOneAndDelete({
      username,
    }).select('-password');

    if (!deletedUser) {
      throw Error('Error deleting user');
    }

    return deletedUser;
  } catch (error) {
    return { error: `Error occurred when finding user: ${error}` };
  }
};

/**
 * Updates user information in the database.
 *
 * @param {string} username - The username of the user to update.
 * @param {Partial<User>} updates - An object containing the fields to update and their new values.
 * @returns {Promise<UserResponse>} - Resolves with the updated user object (without the password) or an error message.
 */
export const updateUser = async (
  username: string,
  updates: Partial<User>,
): Promise<UserPopulatedResponse> => {
  try {
    const updatedUser: SafePopulatedDatabaseUser | null = await UserModel.findOneAndUpdate(
      { username },
      { $set: updates },
      { new: true },
    )
      .select('-password')
      .populate<{ postsCreated: PopulatedDatabasePost[] }>([
        {
          path: 'postsCreated',
          model: PostModel,
          populate: { path: 'recipe', model: RecipeModel },
        },
      ]);
    if (!updatedUser) {
      throw Error('Error updating user');
    }

    return updatedUser;
  } catch (error) {
    return { error: `Error occurred when updating user: ${error}` };
  }
};

/**
 * Updates the current user's following list by following the selected user.
 *
 * @param {User} username - The username of the user to update.
 * @param {User} usernameFollowed - The new user to add to the following list.
 * @returns {Promise<UserResponse>} - Resolves with the updated follower list or an error message.
 */

export const followUserService = async (
  username: string,
  usernameFollowed: string,
): Promise<UserResponse> => {
  try {
    if (username === usernameFollowed) {
      throw Error('Cannot follow yourself');
    }

    const user = await getUserByUsername(username);
    const userFollowed = await getUserByUsername(usernameFollowed);

    if ('error' in user || 'error' in userFollowed) {
      throw Error('One or both users not found');
    }

    if (user.following.includes(usernameFollowed)) {
      throw Error(`You already follow ${usernameFollowed}`);
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { username },
      { $push: { following: usernameFollowed } },
      { new: true },
    ).select('-password');

    const updatedFollowedUser = await UserModel.findOneAndUpdate(
      { username: usernameFollowed },
      { $push: { followers: username } },
      { new: true },
    ).select('-password');

    if (!updatedUser || !updatedFollowedUser) {
      throw Error('Error updating following and followers');
    }

    return updatedUser;
  } catch (error) {
    return { error: `Error while following user: ${usernameFollowed}: ${error}` };
  }
};

/**
 * Updates the current user's following list by following the selected user.
 *
 * @param {User} username - The username of the user to update.
 * @param {User} usernameUnfollowed - The new user to add to the following list.
 * @returns {Promise<UserResponse>} - Resolves with the updated follower list or an error message.
 */

export const unfollowUserService = async (
  username: string,
  usernameUnfollowed: string,
): Promise<UserResponse> => {
  try {
    if (username === usernameUnfollowed) {
      throw Error('Cannot unfollow yourself');
    }

    const user = await getUserByUsername(username);
    const userUnfollowed = await getUserByUsername(usernameUnfollowed);

    if ('error' in user || 'error' in userUnfollowed) {
      throw Error('One or both users not found');
    }

    if (!user.following.includes(usernameUnfollowed)) {
      throw Error(`You cannot unfollow ${usernameUnfollowed}, you do not follow them`);
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { username },
      { $pull: { following: usernameUnfollowed } },
      { new: true },
    ).select('-password');

    const updatedUnfollowedUser = await UserModel.findOneAndUpdate(
      { username: usernameUnfollowed },
      { $pull: { followers: username } },
      { new: true },
    ).select('-password');

    if (!updatedUser || !updatedUnfollowedUser) {
      throw Error('Error updating following and followers');
    }

    return updatedUser;
  } catch (error) {
    return { error: `Error while unfollowing user: ${usernameUnfollowed}: ${error}` };
  }
};

/**
 * Updates the ranking of a recipe for a specific user.
 * @param username The username of the user.
 * @param recipeId The ID of the recipe being ranked.
 * @param ranking The ranking assigned by the user.
 * @returns The updated user document or an error object.
 */
export const updateRecipeRanking = async (
  username: string,
  postID: ObjectId,
  ranking: number,
): Promise<UserResponse> => {
  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      { username }, // Find the user by username
      { $set: { [`rankings.${postID}`]: ranking } },
      { new: true },
    ).select('-password');

    if (!updatedUser) {
      return { error: 'User not found' };
    }

    return updatedUser;
  } catch (error) {
    return { error: `Error updating ranking: ${error}` };
  }
};
