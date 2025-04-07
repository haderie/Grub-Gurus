import { Schema } from 'mongoose';
import { Recipe } from '../../types/types';

/**
 * Mongoose schema for the Recipe collection.
 *
 * This schema defines the structure for storing recipes in the database. Each recipe includes the following fields:
 *
 * - `user`: A reference to the `User` document who created the recipe.
 * - `title`: The title of the recipe.
 * - `privacyPublic`: A boolean indicating whether the recipe is public or private. Defaults to `false`.
 * - `ingredients`: An array of ingredient names required for the recipe.
 * - `description`: A text description of the recipe. Defaults to an empty string if not provided.
 * - `instructions`: Step-by-step instructions for preparing the recipe. Defaults to an empty string if not provided.
 * - `video`: An optional URL string for a video tutorial related to the recipe.
 * - `tags`: An array of references to `Tag` documents that categorize the recipe.
 * - `cookTime`: The cooking time for the recipe, in minutes.
 * - `addedToCalendar`: A boolean indicating whether the recipe is added to the user's calendar.
 * - `start`: The start time for the recipe when added to the calendar.
 * - `end`: The end time for the recipe when added to the calendar.
 * - `color`: The color associated with the recipe's calendar event.
 */

const recipeSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },

    title: {
      type: String,
      required: true,
    },

    privacyPublic: {
      type: Boolean,
      required: true,
      default: false,
    },

    ingredients: {
      type: [String],
      required: true,
    },

    description: {
      type: String,
      default: '',
    },

    instructions: {
      type: String,
      default: '',
    },

    video: {
      type: String,
      default: null,
    },

    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],

    cookTime: {
      type: Number,
      required: true,
    },
    addedToCalendar: { type: Boolean, default: false },
    start: {
      type: Date,
      required(this: Recipe) {
        return this.addedToCalendar;
      },
      default: null,
    },
    end: {
      type: Date,
      required(this: Recipe) {
        return this.addedToCalendar;
      },
      default: null,
    },
    color: {
      type: String,
      default: '#ff0000',
    },
  },
  { collection: 'Recipe', timestamps: true },
);

export default recipeSchema;
