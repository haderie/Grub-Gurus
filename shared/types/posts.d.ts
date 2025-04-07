import { ObjectId } from 'mongodb';
import { Request } from 'express';

/**
 * Represents a post made by a user.
 * - `username`: The username of the user who made the post.
 * - `recipe`: A reference to the recipe associated with the post.
 * - `text`: The text content of the post (optional).
 * - `datePosted`: The date and time when the post was created.
 * - `likes`: An array of usernames who liked the post.
 * - `saves`: An array of usernames who saved the post.
 */
export interface Posts {
  username: string;
  recipe: Recipe; // Ensure Recipe is defined or imported
  text?: string; // Optional text for the post
  datePosted: Date;
  likes: string[]; // Array of usernames who liked the post
  saves: string[]; // Array of usernames who saved the post
}

/**
 * Represents the HTTP request to add a post.
 * - `body`: Contains the `Posts` object that needs to be added to the database.
 */
export interface AddPostRequest extends Request {
  body: Posts;
}

/**
 * Represents a post in the database with a unique identifier.
 * - `_id`: The unique identifier for the post in the database.
 * - `recipe`: A reference to the recipe, stored as an ObjectId.
 * - `username`: The username of the user who made the post.
 * - `datePosted`: The date and time when the post was created.
 * - `likes`: An array of usernames who liked the post.
 * - `saves`: An array of usernames who saved the post.
 */
export interface DatabasePost extends Omit<Posts, 'recipe'> {
  _id: ObjectId;
  recipe: ObjectId;
}

/**
 * Type representing a possible response for a single post-related operation.
 * - Can either be a `DatabasePost` object or an error message if something went wrong.
 */
export type PostResponse = DatabasePost | { error: string };

/**
 * Type representing a possible response for multiple post-related operations.
 * - Can either be an array of `DatabasePost` objects or an error message.
 */
export type PostsResponse = DatabasePost[] | { error: string };

/**
 * Represents a fully populated post from the database.
 * - `recipe`: A fully populated `PopulatedDatabaseRecipe` object, containing full recipe details.
 */
export interface PopulatedDatabasePost extends Omit<DatabasePost, 'recipe'> {
  recipe: PopulatedDatabaseRecipe;
}

/**
 * Represents the HTTP request to update likes on a post.
 * - `body`: Contains `postID` (the ID of the post) and `username` (the user who liked the post).
 */
export interface UpdateLikesRequest extends Request {
  body: {
    postID: ObjectId;
    username: string;
  };
}