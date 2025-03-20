import { ObjectId } from 'mongodb';
import { Recipe } from './recipe';

/**
 * Represents a tag used for categorizing content.
 * - `name`: The name of the tag.
 * - `description`: A brief description of the tag's purpose or usage.
 */
export interface Posts {
  recipe: Recipe;
  youtubeVideoUrl?: string;
}

export interface AddPostRequest extends Request {
  body: Recipe;
}

/**
 * Represents a post in the database with a unique identifier.
 * - `recipes`: Recipes posted.
 * - `_id`: The unique identifier for the tag.
 */
export interface DatabasePost extends Omit<Posts, 'recipe'> {
  _id: ObjectId;
  recipe: ObjectId;
}

/**
 * Type representing possible responses for a Post-related operation.
 * - Either a `DatabasePost` object or an error message.
 */
export type PostResponse = DatabasePost | { error: string };

/**
 * Type representing possible responses for a Post-related operation.
 * - Either a `DatabasePost` object or an error message.
 */
export type PostsResponse = DatabasePost[] | { error: string };

/**
 * Represents a fully populated question from the database.
 * - `tags`: An array of populated `DatabaseTag` objects.
 * - `answers`: An array of populated `PopulatedDatabaseAnswer` objects.
 * - `comments`: An array of populated `DatabaseComment` objects.
 */
export interface PopulatedDatabasePost extends Omit<DatabasePost, 'recipe'> {
  recipe: PopulatedDatabaseRecipe;
}
