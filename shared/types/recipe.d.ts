import { ObjectId } from 'mongodb';
import { Request } from 'express';
import { DatabaseTag, Tag } from './tag';
import { DatabaseUser } from './user';

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
  user: User;
  title: string;
  privacyPublic: boolean;
  ingredients: string[];
  description: string;
  instructions: string;
  video?: string;
  tags: Tag[];
  cookTime: number;
  numOfLikes: number;
  views: string[];
}

/*
export interface Recipe {
  title: string;
  ingredients: string[];
  instructions: string;
  video?: string;
  cookTime: number;
}

export interface RecipePost extends Recipe {
  privacyPublic: boolean;
  description: string;
  tags: Tag[];
  numOfLikes: number;
  views: string[];
}
*/

/**
 * Represents minimal recipe data used for summaries.
 * - `name`: The title of the recipe.
 * - `likes`: The number of likes received.
 */
export interface RecipeData {
  title: string;
  likes: number;
  views: string[];
}

export interface RecipeCalendarEvent
  extends Omit<Recipe, 'user' | 'tags' | 'numOfLikes' | 'privacyPublic' | 'views' | 'description'> {
  start: Date;
  end: Date;
}

export type RecipeResponse = Recipe | { error: string };

export interface RecipeByUsernameRequest extends Request {
  params: {
    username: string;
  };
}
/**
 * Represents a recipe stored in the database with a unique identifier.
 * - `_id`: The unique identifier for the recipe.
 * - Includes all properties of `Recipe`.
 */
export interface DatabaseRecipe extends Omit<Recipe, 'user' | 'tags'> {
  _id: ObjectId;
  user: ObjectId; // Fully populated user object
  tags: ObjectId[]; // Fully populated tags
}
/**
 * Represents a fully populated recipe from the database.
 * - `user`: The full `User` object instead of just an ID.
 * - `tags`: An array of populated `DatabaseTag` objects.
 */
export interface PopulatedDatabaseRecipe extends Omit<DatabaseRecipe, 'user' | 'tags'> {
  user: DatabaseUser; // Fully populated user object
  tags: DatabaseTag[]; // Fully populated tags
}

/**
 * Interface for the request query to find questions using a search string.
 * - `order`: The order in which to sort the recipe.
 * - `search`: The search string used to find recipe.
 */
export interface FindRecipeRequest extends Request {
  params: {
    username: string;
  };
  query: {
    order: OrderType;
    search: string;
  };
}
