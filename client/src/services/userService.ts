import axios from 'axios';
import { ObjectId } from 'mongodb';
import { UserCredentials, SafeDatabaseUser, SafePopulatedDatabaseUser } from '../types/types';
import api from './config';

const USER_API_URL = `${process.env.REACT_APP_SERVER_URL}/user`;

/**
 * Function to get users
 *
 * @throws Error if there is an issue fetching users.
 */
const getUsers = async (): Promise<SafeDatabaseUser[]> => {
  const res = await api.get(`${USER_API_URL}/getUsers`);
  if (res.status !== 200) {
    throw new Error('Error when fetching users');
  }
  return res.data;
};

/**
 * Function to get users
 *
 * @throws Error if there is an issue fetching users.
 */
const getUserByUsername = async (username: string): Promise<SafePopulatedDatabaseUser> => {
  const res = await api.get(`${USER_API_URL}/getUser/${username}`);
  if (res.status !== 200) {
    throw new Error('Error when fetching user');
  }
  return res.data;
};

/**
 * Sends a POST request to create a new user account.
 *
 * @param user - The user credentials (username and password) for signup.
 * @returns {Promise<User>} The newly created user object.
 * @throws {Error} If an error occurs during the signup process.
 */
const createUser = async (user: UserCredentials): Promise<SafeDatabaseUser> => {
  try {
    const res = await api.post(`${USER_API_URL}/signup`, user);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(`Error while signing up: ${error.response.data}`);
    } else {
      throw new Error('Error while signing up');
    }
  }
};

/**
 * Sends a POST request to authenticate a user.
 *
 * @param user - The user credentials (username and password) for login.
 * @returns {Promise<User>} The authenticated user object.
 * @throws {Error} If an error occurs during the login process.
 */
const loginUser = async (user: UserCredentials): Promise<SafeDatabaseUser> => {
  try {
    const res = await api.post(`${USER_API_URL}/login`, user);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(`Error while logging in: ${error.response.data}`);
    } else {
      throw new Error('Error while logging in');
    }
  }
};

/**
 * Deletes a user by their username.
 * @param username - The unique username of the user
 * @returns A promise that resolves to the deleted user data
 * @throws {Error} If the request to the server is unsuccessful
 */
const deleteUser = async (username: string): Promise<SafeDatabaseUser> => {
  const res = await api.delete(`${USER_API_URL}/deleteUser/${username}`);
  if (res.status !== 200) {
    throw new Error('Error when deleting user');
  }
  return res.data;
};

/**
 * Resets the password for a user.
 * @param username - The unique username of the user
 * @param newPassword - The new password to be set for the user
 * @returns A promise that resolves to the updated user data
 * @throws {Error} If the request to the server is unsuccessful
 */
const resetPassword = async (username: string, newPassword: string): Promise<SafeDatabaseUser> => {
  const res = await api.patch(`${USER_API_URL}/resetPassword`, {
    username,
    password: newPassword,
  });
  if (res.status !== 200) {
    throw new Error('Error when resetting password');
  }
  return res.data;
};

/**
 * Updates the user's biography.
 * @param username The unique username of the user
 * @param newBiography The new biography to set for this user
 * @returns A promise resolving to the updated user
 * @throws Error if the request fails
 */
const updateBiography = async (
  username: string,
  newBiography: string,
): Promise<SafePopulatedDatabaseUser> => {
  const res = await api.patch(`${USER_API_URL}/updateBiography`, {
    username,
    biography: newBiography,
  });
  if (res.status !== 200) {
    throw new Error('Error when updating biography');
  }
  return res.data;
};

/**
 * Updates the user's recipe book privacy setting.
 * @param username The unique username of the user
 * @param newRecipeBookPublic The new boolean indicating recipeBookPrivacy status
 * @returns A promise resolving to the updated user
 * @throws Error if the request fails
 */
const updateRecipeBookPrivacy = async (
  username: string,
  newRecipeBookPublic: boolean,
): Promise<SafePopulatedDatabaseUser> => {
  const res = await api.patch(`${USER_API_URL}/updateRecipeBookPrivacy`, {
    username,
    recipeBookPublic: newRecipeBookPublic,
  });
  if (res.status !== 200) {
    throw new Error('Error when updating biography');
  }
  return res.data;
};

/**
 * Updates the user's certified status.
 * @param username The unique username of the user
 * @returns A promise resolving to the updated user
 * @throws Error if the request fails
 */
const updateCertifiedStatus = async (username: string): Promise<SafePopulatedDatabaseUser> => {
  const res = await api.patch(`${USER_API_URL}/updateCertifiedStatus`, {
    username,
    certified: true,
  });
  if (res.status !== 200) {
    throw new Error('Error when updating certification');
  }
  return res.data;
};

/**
 * Follow a user by username
 * @param username - The unique username of the user
 * @param userToFollow - The username of the user to follow
 * @returns A promise resolving to the updated user
 * @throws Error if the request fails
 */
const followUser = async (
  username: string,
  usernameToFollow: string,
): Promise<SafeDatabaseUser> => {
  const res = await api.patch(`${USER_API_URL}/followUser`, {
    username,
    usernameFollowed: usernameToFollow,
  });
  if (res.status !== 200) {
    throw new Error('Error following user');
  }
  return res.data;
};

/**
 * Updates the user's profile privacy settings.
 * @param username - The username of the user
 * @param privacySetting - The new privacy setting
 * @returns A promise resolving to the updated user
 * @throws Error if the request fails
 */
const updatePrivacy = async (
  username: string,
  privacySetting: 'Public' | 'Private',
): Promise<SafePopulatedDatabaseUser> => {
  const res = await api.patch(`${USER_API_URL}/updatePrivacy`, {
    username,
    privacySetting,
  });

  if (res.status !== 200) {
    throw new Error('Error when updating privacy setting');
  }

  return res.data;
};

/**
 * Updates the user's saved posts.
 * @param username - The username of the user
 * @param privacySetting - The new post.
 * @returns A promise resolving to the updated user
 * @throws Error if the request fails
 */
const savePost = async (
  username: string,
  postID: ObjectId,
  action: 'save' | 'remove',
): Promise<SafePopulatedDatabaseUser> => {
  const res = await api.patch(`${USER_API_URL}/savePost`, {
    username,
    postID,
    action,
  });

  if (res.status !== 200) {
    throw new Error('Error when saving post');
  }

  return res.data;
};

/**
 * Updates the user's high score.
 * @param username The unique username of the user
 * @param newHighScore The new high score to set for this user
 * @returns A promise resolving to the updated user
 * @throws Error if the request fails
 */
const updateHighScore = async (
  username: string,
  newHighScore: number,
): Promise<SafePopulatedDatabaseUser> => {
  const res = await api.patch(`${USER_API_URL}/updateHighScore`, {
    username,
    highScore: newHighScore,
  });
  if (res.status !== 200) {
    throw new Error('Error when updating high score');
  }
  return res.data;
};

const updateRanking = async (
  username: string,
  postID: ObjectId,
  ranking: number,
): Promise<SafePopulatedDatabaseUser> => {
  const res = await api.post(`${USER_API_URL}/rank-recipe`, {
    username,
    postID,
    ranking,
  });

  if (res.status !== 200) {
    throw new Error('Error when saving post');
  }
  return res.data;
};

export {
  getUsers,
  getUserByUsername,
  loginUser,
  createUser,
  deleteUser,
  resetPassword,
  updateBiography,
  followUser,
  updatePrivacy,
  updateRecipeBookPrivacy,
  updateCertifiedStatus,
  updateHighScore,
  savePost,
  updateRanking,
};
