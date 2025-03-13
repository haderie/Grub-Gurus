import mongoose, { Model } from 'mongoose';
import recipeSchema from './schema/recipe.schema';
import { DatabaseRecipe } from '../types/types';

/**
 * Mongoose model for the `Recipe` collection.
 *
 * This model is created using the `DatabaseRecipe` interface and the `recipeSchema`, representing the
 * `Recipe` collection in the MongoDB database, and provides an interface for interacting with
 * stored recipes.
 *
 * @type {Model<DatabaseRecipe>}
 */
const RecipeModel: Model<DatabaseRecipe> = mongoose.model<DatabaseRecipe>('Recipe', recipeSchema);

export default RecipeModel;
