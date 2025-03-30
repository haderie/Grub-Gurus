import { ObjectId } from 'mongodb';
import { Request } from 'express';
import { DatabaseTag, Tag } from './tag';
import { DatabaseUser } from './user';

/**
 * Represents a recipe.
 * - `user`: The ID of the user who created the recipe.
 * - `title`: The title of the recipe.
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
  addedToCalendar: boolean;
}

/**
 * Represents minimal recipe data used for summaries.
 * - `title`: The title of the recipe.
 */
export interface RecipeData {
  title: string;
}

/**
 * Represents recipe data used for calendar.
 * - `start`: Start of recipe cooking.
 * - `end`: End of recipe cooking.
 */
export interface RecipeCalendarEvent extends Recipe {
  start: Date;
  end: Date;
  color: string;
}

export type RecipeResponse = DatabaseRecipe | { error: string };

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
  user: ObjectID; // Fully populated user object
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

/* Interface for the request body when adding a new recipe.
 * - `body`: The recipe being added.
 */
export interface AddRecipeRequest extends Request {
  body: Recipe;
}

/* Interface for the request body when adding a new calendar recipe.
 * - `body`: The calendar recipe being added.
 */
export interface AddCalendarRecipeRequest extends Request {
  body: RecipeCalendarEvent;
}

export interface UpdateCalendarRecipeRequest extends Request {
  body: {
    recipeID: ObjectId;
    addedToCalendar: boolean;
    start: Date;
    end: Date;
    color: string;
  };
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

export interface RecipeForPost extends Recipe {
  _id: ObjectId;
}
