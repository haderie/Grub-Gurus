import { ObjectId } from 'mongodb';
import { Request } from 'express';
import { DatabaseTag, Tag } from './tag';
import { DatabaseUser } from './user';

/**
 * Represents a recipe.
 * - `user`: The user who created the recipe, referenced by their `User` object.
 * - `title`: The title of the recipe.
 * - `privacyPublic`: A boolean indicating whether the recipe is public or private.
 * - `ingredients`: An array of ingredient names required for the recipe.
 * - `description`: A detailed description of the recipe.
 * - `instructions`: The instructions on how to prepare the recipe.
 * - `video`: An optional URL to a video tutorial for the recipe.
 * - `tags`: An array of associated tags, either as strings or references to `Tag` documents.
 * - `cookTime`: The estimated cooking time in minutes.
 * - `numOfLikes`: The number of likes the recipe has received.
 * - `views`: An array of users who have viewed the recipe.
 * - `addedToCalendar`: A boolean indicating whether the recipe has been added to a calendar.
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
 * Represents recipe data used for calendar events.
 * - `start`: The start time for cooking the recipe.
 * - `end`: The end time for cooking the recipe.
 * - Inherits all properties of the `Recipe` interface.
 */
export interface RecipeCalendarEvent extends Recipe {
  start: Date;
  end: Date;
  color: string;
}

/**
 * Represents a possible response when fetching recipe data.
 * - Either a `DatabaseRecipe` object or an error message.
 */
export type RecipeResponse = DatabaseRecipe | { error: string };

/**
 * Represents the HTTP request to fetch a recipe by username.
 * - `params`: Contains the `username` for which to fetch recipes.
 */
export interface RecipeByUsernameRequest extends Request {
  params: {
    username: string;
  };
}

/**
 * Represents a recipe stored in the database with a unique identifier.
 * - `_id`: The unique identifier for the recipe.
 * - `user`: The user who created the recipe, referenced by their `ObjectId`.
 * - `tags`: An array of `ObjectId` references to the tags associated with the recipe.
 */
export interface DatabaseRecipe extends Omit<Recipe, 'user' | 'tags'> {
  _id: ObjectId;
  user: ObjectId;
  tags: ObjectId[];
}

/**
 * Represents a fully populated recipe from the database.
 * - `user`: The full `DatabaseUser` object representing the user who created the recipe.
 * - `tags`: An array of populated `DatabaseTag` objects associated with the recipe.
 */
export interface PopulatedDatabaseRecipe extends Omit<DatabaseRecipe, 'user' | 'tags'> {
  user: DatabaseUser;
  tags: DatabaseTag[];
}

/**
 * Represents the request body for adding a new recipe.
 * - `body`: Contains the `Recipe` object being added.
 */
export interface AddRecipeRequest extends Request {
  body: Recipe;
}

/**
 * Represents the request body for adding a new recipe as a calendar event.
 * - `body`: Contains the `RecipeCalendarEvent` object being added.
 */
export interface AddCalendarRecipeRequest extends Request {
  body: RecipeCalendarEvent;
}

/**
 * Represents the request body for updating a calendar recipe.
 * - `body`: Contains `recipeID`, `addedToCalendar`, `start`, `end`, and `color` for the update.
 */
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
 * Represents the request query to search for recipes.
 * - `order`: The order in which to sort the recipes.
 * - `search`: The search string used to filter recipes.
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

/**
 * Represents recipe data for a post, including the recipe ID.
 * - `_id`: The unique identifier of the recipe.
 */
export interface RecipeForPost extends Recipe {
  _id: ObjectId;
}
