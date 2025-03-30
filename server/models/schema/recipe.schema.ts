import { Schema } from 'mongoose';
import { Recipe } from '../../types/types';

/**
 * Mongoose schema for the Recipe collection.
 *
 * This schema defines the structure for storing questions in the database.
 * Each question includes the following fields:
 * - `user`: References `User` documents associated with the recipe.
 * - `name`: The title of the recipe.
 * - `privacyPublic`: Boolean indicating whether the recipe is public or private.
 * - `ingredients`: An array of ingredients names that is in the recipe.
 * - `description`: A text description of the recipe.
 * - `video`: An optional string URL for a video tutorial.
 * - `tags`: An array of references to `Tag` documents associated with the question.
 * - `cookTime`: The cooking time for the recipe in minutes.
 * - `numOfLikes`: The number of likes this recipe has received.
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
