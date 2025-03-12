import axios from 'axios';
import { UserCredentials, SafeDatabaseUser } from '../types/types';
import api from './config';

const RECIPE_API_URL = `${process.env.REACT_APP_SERVER_URL}/recipe`;

/**
 * Function to get users
 *
 * @throws Error if there is an issue fetching users.
 */
const getRecipeByUsername = async (username: string) => {
  const res = await api.get(`${RECIPE_API_URL}/getRecipe/${username}`);
  if (res.status !== 200) {
    throw new Error('Error when fetching user');
  }
  return res.data;
};

// eslint-disable-next-line import/prefer-default-export
export { getRecipeByUsername };
