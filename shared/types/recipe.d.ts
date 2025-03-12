import { ObjectId } from 'mongodb';

/**
 * Represents a recipe.
 * - `user`: The ID of the user who created the recipe.
 * - `name`: The title of the recipe.
 * - `privacyPublic`: Indicates whether the recipe is public or private.
 * - `ingredients`: An array of ingredient names.
 * - `description`: A detailed description of the recipe.
 * - `video`: An optional URL string for a video tutorial.
 * - `tags`: An array of associated tags (either strings or references to `Tag` documents).
 * - `cookTime`: The estimated cooking time in minutes.
 * - `numOfLikes`: The number of likes received.
 */
export interface Recipe {
  user: ObjectId;
  name: string;
  privacyPublic: boolean;
  ingredients: string[];
  description: string;
  video?: string;
  tags?: string[];
  cookTime: number;
  numOfLikes: number;
}

/**
 * Represents minimal recipe data used for summaries.
 * - `name`: The title of the recipe.
 * - `likes`: The number of likes received.
 */
export interface RecipeData {
  name: string;
  likes: number;
}

/**
 * Represents a recipe stored in the database with a unique identifier.
 * - `_id`: The unique identifier for the recipe.
 * - Includes all properties of `Recipe`.
 */
export interface DatabaseRecipe extends Recipe {
  _id: ObjectId;
}
