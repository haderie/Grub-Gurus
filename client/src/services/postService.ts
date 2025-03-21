import { PopulatedDatabasePost, Recipe } from '../types/types';
import api from './config';

const POST_API_URL = `${process.env.REACT_APP_SERVER_URL}/posts`;

/**
 * Function to add a new question.
 *
 * @param q - The question object to add.
 * @throws Error if there is an issue creating the new question.
 */
const addPost = async (q: Recipe): Promise<PopulatedDatabasePost> => {
  const res = await api.post(`${POST_API_URL}/addPost`, q);

  if (res.status !== 200) {
    throw new Error('Error while creating a new POST');
  }

  return res.data;
};

/**
 * Function to get posts
 *
 * @throws Error if there is an issue fetching posts.
 */
const getPosts = async (): Promise<PopulatedDatabasePost[]> => {
  const res = await api.get(`${POST_API_URL}/getPosts`);

  if (res.status !== 200) {
    throw new Error('Error while fetching posts');
  }

  return res.data;
};

/**
 * Function to get posts from users that you follow.
 *
 * @throws Error if there is an issue fetching posts.
 */
const getFollowingPosts = async (): Promise<PopulatedDatabasePost[]> => {
  const res = await api.get(`${POST_API_URL}/getFollowingPosts`);

  if (res.status !== 200) {
    throw new Error('Error while fetching posts');
  }

  return res.data;
};

export { addPost, getPosts, getFollowingPosts };
