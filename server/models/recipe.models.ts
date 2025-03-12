import mongoose, { Model } from 'mongoose';
import recipeSchema from './schema/recipe.schema';
import { DatabaseRecipe } from '../types/types';

/**
 * Mongoose model for the `Tag` collection.
 *
 * This model is created using the `Tag` interface and the `tagSchema`, representing the
 * `Tag` collection in the MongoDB database, and provides an interface for interacting with
 * the stored tags.
 *
 * @type {Model<DatabaseTag>}
 */
const TagModel: Model<DatabaseRecipe> = mongoose.model<DatabaseRecipe>('Recipe', recipeSchema);

export default TagModel;
