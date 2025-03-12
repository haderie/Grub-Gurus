import api from './config';

const RECIPE_API_URL = `${process.env.REACT_APP_SERVER_URL}/recipe`;

/**
 * Function to get recipes by username
 *
 * @throws Error if there is an issue fetching users.
 */
const getRecipesByUsername = async (username: string) => {
  const res = await api.get(`${RECIPE_API_URL}/getRecipes/${username}`);
  if (res.status !== 200) {
    throw new Error('Error when fetching user');
  }
  return res.data;
};

// /**
//  * Function to get questions by filter.
//  *
//  * @param order - The order in which to fetch questions. Default is 'newest'.
//  * @param search - The search term to filter questions. Default is an empty string.
//  * @throws Error if there is an issue fetching or filtering questions.
//  */
// const getRecipeByFilter = async (
//   order: string = 'newest',
//   search: string = '',
// ): Promise<PopulatedDatabaseRecipe[]> => {
//   const res = await api.get(`${RECIPE_API_URL}/getRecipe?order=${order}&search=${search}`);
//   if (res.status !== 200) {
//     throw new Error('Error when fetching or filtering questions');
//   }
//   return res.data;
// };

// eslint-disable-next-line import/prefer-default-export
export { getRecipesByUsername };
